import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/projects.model.js";
import mongoose from "mongoose";


const addProject = asyncHandler(async (req, res) => {

    const project = await Project.create(req.body);

    return res.status(201).json(
        new ApiResponse(200, project, "Project added successfully")
    );
});

export{addProject}