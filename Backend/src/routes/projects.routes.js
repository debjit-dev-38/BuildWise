import { Router } from "express";
import multer from "multer";
import { addProject } from "../controllers/projects.controller.js";

const router = Router();


router.route("/add-project").post(addProject);

export default router