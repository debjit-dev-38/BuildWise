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

export { addProject,uploadImage,uploadPdf }