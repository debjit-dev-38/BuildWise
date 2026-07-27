import { Router } from "express";
import multer from "multer";
import {updateProject,uploadImageByUrl,uploadPdfByUrl,getProjectBySlug,deleteProject, getProject,addProject,uploadImage,uploadPdf } from "../controllers/projects.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyAdmin} from "../middlewares/verifyAdmin.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.route("/add-project").post(verifyJWT,verifyAdmin,addProject);

router.route("/upload-pdf").post(verifyJWT,verifyAdmin,upload.single("pdf"), uploadPdf)

router.route("/upload-pdf-by-url").post(verifyJWT,verifyAdmin,uploadPdfByUrl)

router.route("/upload-image").post(verifyJWT,verifyAdmin,upload.single("image"), uploadImage)

router.route("/upload-image-by-url").post(verifyJWT,verifyAdmin,uploadImageByUrl)

router.route("/get-project").get(getProject)

router.route("/update-project/:id").put(verifyJWT,verifyAdmin,updateProject);

router.route("/get-project/:slug").get(getProjectBySlug)

router.route("/delete-project/:id").delete(verifyJWT,verifyAdmin,deleteProject)


export default router