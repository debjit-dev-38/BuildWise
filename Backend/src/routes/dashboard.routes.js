import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getUserProjects,getUserStats,getDashboardCard} from "../controllers/dashboard.controller.js";

const router=Router()


router.get("/get-dashboardCard",verifyJWT,getDashboardCard);
router.get("/get-UserStats",verifyJWT,getUserStats);
router.get("/get-UserProjects",verifyJWT,getUserProjects);


export default router
