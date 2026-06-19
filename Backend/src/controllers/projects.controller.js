import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/projects.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose";


const addProject = asyncHandler(async (req, res) => {

    const project = await Project.create(req.body);
    return res.status(201).json(
        new ApiResponse(200, project, "Project added successfully")
    );
});

const uploadImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);

    if (!uploadedImage) {
        throw new ApiError(500, "Image upload failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
                url: uploadedImage.secure_url,
                publicId: uploadedImage.public_id,
                originalName: req.file.originalname,
            },
            "Image uploaded successfully"
        )
    );
});

const uploadPdf = asyncHandler(async (req, res) => {
    const pdfLocalPath = req.file?.path;

    if (!pdfLocalPath) {
        throw new ApiError(400, "PDF file is required");
    }

    const uploadedPdf = await uploadOnCloudinary(
        pdfLocalPath,
        "raw"
    );

    if (!uploadedPdf) {
        throw new ApiError(500, "PDF upload failed");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
                url: uploadedPdf.secure_url,
                publicId: uploadedPdf.public_id,
                originalName: req.file.originalname,
            },
            "PDF uploaded successfully"
        )
    );
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      project,
      "Project updated successfully"
    )
  );
});
const uploadPdfByUrl = asyncHandler(async (req, res) => {
    const { url } = req.body

    if (!url)
        throw new ApiError(400, "Pdf url is required")
    const originalName =
        url.split("/").pop()?.split("?")[0] ||
        "Imported from URL";
    const uploadedUrl = await uploadOnCloudinary(url);

    if (!uploadedUrl)
        throw new ApiError(500, "Pdf url upload failed")

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
                url: uploadedUrl.secure_url,
                publicId: uploadedUrl.public_id,
                originalName: originalName,
            },
            "Pdf url uploaded successfully"
        )
    )
})

const uploadImageByUrl = asyncHandler(async (req, res) => {
    const { url } = req.body

    if (!url)
        throw new ApiError(400, "Image url required")

    const originalName = url.split("/").pop()?.split("?")[0] || "Imported for Url"

    const uploadedUrl = await uploadOnCloudinary(url)

    if (!uploadedUrl)
        throw new ApiError(500, "Upload failed")

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                success: true,
                url: uploadedUrl.secure_url,
                publicId: uploadedUrl.public_id,
                originalName: originalName,
            },
            "Image Url Uploaded Successfully"
        )
    )
})

const getProject = asyncHandler(async (req, res) => {
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
/*
Normally, when you use:const projects = await Project.find();
Mongoose takes the data returned by MongoDB and wraps each document with extra features such as .save(), .validate(), .populate(), and change tracking. This requires additional processing and mem[...]
When you use:
const projects = await Project.find().lean();
Mongoose skips all that extra work and returns the raw data directly. The result is faster queries, lower memory usage, and better performance, especially when fetching many records.
The tradeoff is that the returned objects no longer have Mongoose methods like .save() or .validate(). Therefore, .lean() is best used for read-only operations where you're simply fetching data a[...]
For your getProject API, where you're only reading projects and returning JSON, using .lean() is a good optimization because you don't need any of Mongoose's document features.
*/
const deleteProject = asyncHandler(async (req, res) => {


    await Project.findByIdAndDelete(req.params.id)
    return res.status(200).json(
        new ApiResponse(200, "Project deleted successfully")
    )
})

const getProjectBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params

    const project = await Project.findOne({ slug });
    return res.status(200).json(
        new ApiResponse(200, project, "Projects fetched successfully")
    )
})

export {updateProject, uploadImageByUrl, uploadPdfByUrl, getProjectBySlug, deleteProject, getProject, addProject, uploadImage, uploadPdf }
