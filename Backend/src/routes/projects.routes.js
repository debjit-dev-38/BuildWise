import { Router } from "express";
import multer from "multer";
import {getProjectBySlug,deleteProject, getProject,addProject,uploadImage,uploadPdf } from "../controllers/projects.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/add-project").post(addProject);

router.route("/upload-pdf").post(
    upload.single("pdf"), uploadPdf)

router.route("/upload-image").post(
    upload.single("image"), uploadImage)

router.route("/get-project").get(getProject)
router.route("/get-project/:slug").get(getProjectBySlug)
router.route("/delete-project/:id").delete(deleteProject)

export default router