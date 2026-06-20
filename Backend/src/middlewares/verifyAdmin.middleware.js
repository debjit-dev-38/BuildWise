import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// middlewares/verifyAdmin.middleware.js
export const verifyAdmin = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Forbidden: Admin access required");
    }
    next();
});