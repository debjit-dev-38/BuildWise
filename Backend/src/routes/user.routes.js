import { Router } from "express";
import {getAdminProject,updateUserRole,getUsers, changeCurrentPassword, getCurrentUser, loginUser, logoutUser, RefreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import multer from "multer";

const router =Router()

router.route("/register").post( upload.single("image"),registerUser)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(RefreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/role/:id").patch(verifyJWT,verifyAdmin,updateUserRole);

router.route("/get-users").get(verifyJWT,verifyAdmin,getUsers)

router.route("/get-adminProjects").get(verifyJWT,verifyAdmin,getAdminProject)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage) 




export default router