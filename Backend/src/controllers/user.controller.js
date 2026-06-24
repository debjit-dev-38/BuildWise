import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/projects.model.js";
import validator from "validator";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { Enrollment } from "../models/enrollment.model.js";
const generateAccessAndRefreshTokens = async (userId) => {
    /*
        1. User logs in
    2. generateAccessAndRefreshTokens() runs
    3. refreshToken is generated and assigned to user.refreshToken
    4. user.save() fires — but without await, the function doesn't wait for it
    5. Tokens are returned and sent to the client immediately
    6. Meanwhile, MongoDB is still writing the refreshToken in the background
    
    7. [Some time later] Access token expires
    8. Frontend calls POST /refresh-token with the cookie
    9. Backend reads refreshToken from DB
    10. If step 6 hasn't completed yet → DB still has the OLD token
    11. incomingRefreshToken !== user.refreshToken → "Refresh token is expired"
    12. User gets logged out
    */


    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })   //withour await caused auto logging out sometimes

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username exists")
    }

    const user = await User.create({
        fullName,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating user")
    }



    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password")
    if (!user) {
        throw new ApiError(404, "User doesnt exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedUser = await User.findById(user._id).select("-password -refreshToken")


    //cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedUser, accessToken, refreshToken
            },
                "user logged in successfully"
            )
        )

})

const getAdminProject = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 9, 1);

    const {
        category,
        difficulty,
        duration,
        tech,        // comma-separated string, e.g. "react,node"
        sort,
        search,
        featured,
    } = req.query;

    // ── Build the Mongo filter object ──────────────────────────────
    const filter = {};

    if (category && category !== "all") {
        filter.category = category;
    }

    if (difficulty && difficulty !== "All") {
        filter.difficulty = difficulty;
    }

    if (duration && duration !== "Any") {
        filter.duration = duration; // adjust if duration is a range field instead
    }

    if (tech) {
        const techArray = tech.split(",").map(t => t.trim()).filter(Boolean);
        if (techArray.length) {
            filter.stack = { $in: techArray }; // matches if stack array contains any of these
        }
    }

    if (featured === "true") {
        filter.featured = true;
    }

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i"
        };
    }

    // ── Build the sort object ──────────────────────────────────────
    const sortMap = {
        popular: { "metrics.learners": -1 }, // adjust to your actual schema shape
        newest: { createdAt: -1 },
        rating: { "metrics.rating": -1 },
        difficulty: { difficulty: 1 },
    };
    const sortQuery = sortMap[sort] || sortMap.popular;

    // ── Run query + count in parallel ───────────────────────────────
    const [projects, totalProjects] = await Promise.all([

        Project.find(filter)
            .select(
                "_id slug name description color category difficulty duration stack metrics image featured newest recommended status modules"
            )
            .sort(sortQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),

        Project.countDocuments(filter),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                projects,
                totalProjects,
                page,
                totalPages: Math.ceil(totalProjects / limit),
                hasNextPage: page * limit < totalProjects,
            },
            "Projects fetched successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
    };
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

const RefreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized tokens")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("+refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired")
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
        };

        const { accessToken, refreshToken: newrefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access token refreshed successfully"
                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message)
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invaild old password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body
    if (!fullName && !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Coverimage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover image")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            coverImage: coverImage.url
        }
    }, { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Cover image updated"))

})

const getUsers = asyncHandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 9, 1);

    const { role, search } = req.query

    const filter = {}

    if (role && role !== "All") {
        filter.role = role;
    }

    if (search) {
        filter.fullName = {
            $regex: search,
            $options: "i"
        };

    }

    const [users, totalUsers] = await Promise.all([
        User.find(filter)
            .select(
                "_id fullName username email role"
            )
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),

        User.countDocuments(filter),
    ]);
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                totalUsers,
                page,
                totalPages: Math.ceil(totalUsers / limit),
                hasNextPage: page * limit < totalUsers,
            },
            "Users fetched successfully"
        )
    )
})

const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const user = await User.findByIdAndUpdate(
        id,
        { role },
        {
            new: true,
            runValidators: true,
        }
    ).select("_id fullName email role");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            `User role updated to ${role}`
        )
    );
});

const updateUserStats = asyncHandler(async (req, res) => {
    const { action } = req.body
    switch (action) {
        case "update-totalProjects":
            {
                const { projectId } = req.body

                const enrollment = await Enrollment.findOneAndUpdate(
                    {
                        project:projectId,
                        user:req.user._id
                    },
                    {
                        $set: {
                            status: "Completed"
                        }
                    },
                    {
                        new: true
                    })


                    const updatedUser=await User.findOneAndUpdate(
                        req.user._id,
                        {
                            $inc:{
                                "userStats.projectsShipped.value":1,
                            }
                        },
                        {
                            new:true
                        }
                    )

                    return res.status(200).json(
                        new ApiResponse(200,updatedUser,"Project status updated successfully")
                    )
                
            }
    }


})

export {updateUserStats, getAdminProject, updateUserRole, getUsers, registerUser, loginUser, logoutUser, RefreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, }