import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getAnalytics, getPlatformMetrics } from "../controllers/admin.controller.js"

const router=Router()


router.route('/get-PlatformMetrics').get(verifyJWT,getPlatformMetrics)
router.route('/get-Analytics').get(verifyJWT,getAnalytics)


export default router
