import express from "express";
import multer from "multer";

import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {  listCategory, createCategory } from "../controllers/categories.controller.js";

// Setup router
const router = express.Router();


//  Routes
router.post("/create", authMiddleware, createCategory);
router.post("/lists", listCategory);

export default router;
