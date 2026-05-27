import express from "express";
import multer from "multer";

import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {  listBrand, createBrand } from "../controllers/brand.controller.js";

// Setup router
const router = express.Router();


//  Routes
router.post("/create", authMiddleware, createBrand);
router.post("/lists",  listBrand);

export default router;
