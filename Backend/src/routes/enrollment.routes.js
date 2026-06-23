import { Router } from "express";
import {getStatus, enrollUser, completedModules } from "../controllers/enrollment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/enroll-user").post(verifyJWT,enrollUser)
router.route("/get-status/:projectId").get(verifyJWT,getStatus)
router.route("/completed-modules").post(verifyJWT,completedModules)


export default router