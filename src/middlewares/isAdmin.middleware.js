import { asyncHandler } from "../utils/helpers.js";
import { errorResponse } from "../utils/response.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
    console.log("USER PAYLOAD:", req.user);
    if (!req.user || req.user.role !== "ADMIN") {
        return errorResponse(res, "Unauthorized", 403);
    }
    next();
});