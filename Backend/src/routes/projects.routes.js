import { Router } from "express";
import multer from "multer";
import {uploadImageByUrl,uploadPdfByUrl,getProjectBySlug,deleteProject, getProject,addProject,uploadImage,uploadPdf } from "../controllers/projects.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/add-project").post(addProject);
router.route("/upload-pdf").post(upload.single("pdf"), uploadPdf)
router.route("upload-pdf-by-url").post(uploadPdfByUrl)
router.route("/upload-image").post(upload.single("image"), uploadImage)
router.route("/upload-image-by-url").post(uploadImageByUrl)
router.route("/get-project").get(getProject)
router.route("/get-project/:slug").get(getProjectBySlug)
router.route("/delete-project/:id").delete(deleteProject)

export default router