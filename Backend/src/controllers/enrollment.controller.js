import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Project } from "../models/projects.model.js";


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

const getStatus = asyncHandler(async (req, res) => {
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
                currentModule:nextModuleId
            }

        },
        {
            new: true
        }
    );

    res.status(200).json(
        new ApiResponse(200, completed, "Completed modules listed")
    )
})


export { completedModules, enrollUser, getStatus }