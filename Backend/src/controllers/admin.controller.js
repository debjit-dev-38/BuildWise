import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Project } from "../models/projects.model.js";
import { User } from "../models/user.model.js";

const getPlatformMetrics = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments()
    const totalProjects = await Project.countDocuments()
    const totalCompletions = await Enrollment.countDocuments({
        status: "Completed"
    })
    const totalEnrollments = await Enrollment.countDocuments()

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalActiveUsers = await User.countDocuments({
        lastLogin: { $gte: thirtyDaysAgo },
    });

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersThisWeek = await User.countDocuments({
        createdAt: { $gte: oneWeekAgo },
    });

    const metrics = {
        totalUsers,
        totalProjects,
        totalCompletions,
        totalEnrollments,  
        totalActiveUsers,
        newUsersThisWeek,
    }

    return res.status(200).json(
        new ApiResponse(200, metrics, "Metrics fetched")
    )

})

const getAnalytics = asyncHandler(async (req, res) => {
    // User Growth (group by month)
    const chartUserGrowth = await User.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                users: { $sum: 1 }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $project: {
                _id: 0,
                month: {
                    $arrayElemAt: [
                        [
                            "",
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec"
                        ],
                        "$_id.month"
                    ]
                },
                users: 1
            }
        }
    ]);

    const chartWeeklyEnrollments = await Enrollment.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        },
        {
            $project: {
                week: {
                    $ceil: {
                        $divide: [
                            { $dayOfMonth: "$createdAt" },
                            7
                        ]
                    }
                }
            }
        },
        {
            $group: {
                _id: "$week",
                enrollments: { $sum: 1 }
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                week: {
                    $concat: [
                        "W",
                        { $toString: "$_id" }
                    ]
                },
                enrollments: 1
            }
        }
    ]);

    const chartProjectCompletions = await Enrollment.aggregate([
        {
            $match: {
                status: "Completed"
            }
        },
        {
            $group: {
                _id: "$project",
                completions: { $sum: 1 }
            }
        },
        {
            $sort: {
                completions: -1
            }
        },
        {
            $limit: 4
        },

        //Think of $lookup as MongoDB's version of Mongoose's .populate(). The key difference is that .populate() works after a query on Mongoose documents, while $lookup performs the join inside the aggregation pipeline, allowing you to continue grouping, sorting, filtering, and reshaping the combined data efficiently.
        {
            $lookup: { //same as join in sql
                from: "projects",  //then Mongoose creates the collection name by lowercasing and pluralizing the model name.
                localField: "_id",
                foreignField: "_id",
                as: "project"
            }
        },
        {
            $unwind: "$project"
        },
        {
            $project: {
                _id: 0,
                project: "$project.name",
                completions: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                chartUserGrowth,
                chartWeeklyEnrollments,
                chartProjectCompletions
            },
            "Analytics fetched successfully"
        )
    );
});


export { getPlatformMetrics, getAnalytics }