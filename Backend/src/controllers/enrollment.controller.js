import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Project } from "../models/projects.model.js";
import { User } from "../models/user.model.js";


const enrollUser = asyncHandler(async (req, res) => {
    const { projectId } = req.body
    const project = await Project.findById(projectId)

    if (!project)
        throw new ApiError(401, "Project doesnt exist")

    const firstMod = project.modules[0]._id;

    if (!firstMod)
        throw new ApiError(401, "Module doesnt exist")

    const enroll = await Enrollment.create({
        project: projectId,
        user: req.user._id,
        currentModule: firstMod

    })

    const enrolled = await Enrollment.findById(enroll._id)

    return res.status(200).json(
        new ApiResponse(200, enrolled, "Enrolled successfully")
    )
})

const getEnrollments = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const enrollment = await Enrollment.findOne(
        {
            project: projectId,
            user: req.user._id
        })

    return res.status(200).json(
        new ApiResponse(200, enrollment, "Status fetched successfully")
    )

})

const completedModules = asyncHandler(async (req, res) => {
    const { projectId, moduleId } = req.body

    const enrollment = await Enrollment.find({
        project: projectId
    });

    const p = await Project.findById(projectId);

    const currentIndex = p.modules.findIndex(
        module => module._id.toString() === moduleId
    );
    const nextModule = p.modules[currentIndex + 1];
    const nextModuleId = nextModule?._id;


    const completed = await Enrollment.findOneAndUpdate(
        {
            user: req.user._id,
            project: projectId
        },
        {
            $addToSet: {
                completedModules: moduleId
            },
            $set: {
                currentModule: nextModuleId,
                lastAccessedAt:Date.now()
            }

        },
        {
            new: true
        }
    );

    const user = await User.findById(req.user._id).select("userStats.xp")
    const xp = user.userStats.xp+100

    const newLevel = Math.floor(xp / 500) + 1
    const moduleHour = p.modules.id(moduleId).duration;
    const duration = Number.parseInt(moduleHour, 10);

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $inc: {
                "userStats.hoursLearned.value": duration,
                "userStats.xp": 100
            },
            $set: {
                "userStats.currentLevel.value": newLevel,
            },
        },
        {
            new: true,
        }
    );
    res.status(200).json(
        new ApiResponse(200, completed, "Completed modules listed")
    )
})

const getDashboardCard = async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export {getDashboardCard, completedModules, enrollUser, getEnrollments }