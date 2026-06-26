import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Project } from "../models/projects.model.js";
import { User } from "../models/user.model.js";


const getDashboardCard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // STEP 1: get MOST RECENT enrollment
    const enrollment = await Enrollment.findOne({
        user: userId,
    })
        .sort({ lastAccessedAt: -1 })
        .lean();

    if (!enrollment) {
        return res.status(404).json({
            success: false,
            message: "Enrollment not found",
        });
    }

    // STEP 2: fetch project from that enrollment
    const project = await Project.findById(enrollment.project).lean();

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    // STEP 3: sort modules safely
    const modules = [...(project.modules || [])].sort(
        (a, b) => a.order - b.order
    );

    const completedSet = new Set(
        (enrollment.completedModules || []).map(String)
    );

    // STEP 4: derive completed + active
    const completedModules = [];
    let activeModule = null;

    for (const m of modules) {
        if (completedSet.has(String(m._id))) {
            completedModules.push(m);
        } else if (!activeModule) {
            activeModule = m;
        }
    }

    const last4Completed = completedModules.slice(-4);

    const totalModules = modules.length;
    const completedCount = completedModules.length;

    const progressPercent =
        totalModules > 0
            ? Math.round((completedCount / totalModules) * 100)
            : 0;

    const activeIndex = modules.findIndex(
        (m) => activeModule && String(m._id) === String(activeModule._id)
    );

    const currentModuleNumber =
        activeIndex >= 0 ? activeIndex + 1 : completedCount + 1;

    // STEP 5: IMPORTANT - include currentModule resolved properly
    const currentModule =
        modules.find(
            (m) => String(m._id) === String(enrollment.currentModule)
        ) || activeModule;

    return res.json({
        success: true,
        data: {
            project: {
                _id: project._id,
                name: project.name,
                difficulty: project.difficulty,
                durationWeeks: project.durationWeeks,
                modules,
            },

            enrollment: {
                projectId: enrollment.project,
                currentModule: enrollment.currentModule,
                completedModules: enrollment.completedModules,
                lastAccessedAt: enrollment.lastAccessedAt,
            },

            ui: {
                progressPercent,
                completedCount,
                totalModules,
                currentModuleNumber,
                activeModule,
                currentModule,
                last4Completed,
            },
        },
    });
}
)


const getUserStats = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("userStats");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const lastActiveDate = user.userStats.lastActiveDate;

    // No learning activity yet
    if (!lastActiveDate) {
        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    ...user.userStats.toObject(),
                    dayStreak: {
                        value: 0,
                    },
                },
                "User stats fetched"
            )
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDay = new Date(lastActiveDate);
    lastDay.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
        (today - lastDay) / (1000 * 60 * 60 * 24)
    );

    // If they missed at least one full calendar day, streak is dead.
    // Yesterday = diffDays 1, so it is still alive.
    if (diffDays > 1 && user.userStats.dayStreak.value !== 0) {
        user.userStats.dayStreak.value = 0;
        await user.save();
    }

    return res.status(200).json(
        new ApiResponse(200, user.userStats, "User stats fetched")
    );
});

const getUserProjects = asyncHandler(async (req, res) => {
    const projects = await Enrollment.find({
        user: req.user._id,
    })
        .sort({ createdAt: -1 }) // newest enrollment first
        .limit(3)
        .select("project")
        .populate({
            path: "project",
            select: "name color duration difficulty image stack.name",
        })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, projects, "Recent projects fetched successfully")
    );
});

export { getUserProjects, getUserStats, getDashboardCard }