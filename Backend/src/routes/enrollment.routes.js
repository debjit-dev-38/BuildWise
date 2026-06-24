import { Router } from "express";
import {getDashboardCard,getEnrollments, enrollUser, completedModules } from "../controllers/enrollment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/enroll-user").post(verifyJWT,enrollUser)
router.route("/get-enrollments/:projectId").get(verifyJWT,getEnrollments)
router.route("/completed-modules").post(verifyJWT,completedModules)
router.get("/dashboard",verifyJWT,getDashboardCard);



export default router