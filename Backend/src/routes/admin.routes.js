import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {verifyAdmin} from "../middlewares/verifyAdmin.middleware.js"
import {getAnalytics, getPlatformMetrics } from "../controllers/admin.controller.js"

const router=Router()


router.route('/get-PlatformMetrics').get(verifyJWT,verifyAdmin,getPlatformMetrics)
router.route('/get-Analytics').get(verifyJWT,verifyAdmin,getAnalytics)


export default router
