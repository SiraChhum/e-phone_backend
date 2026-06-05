import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { listProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

// Setup router
const router = express.Router();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  File Filter (optional: only allow image types)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

//  Multer Storage Configuration
const storage = multer.memoryStorage(); // store files in memory for Cloudinary upload
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
}).single("image");

//  Routes

router.post("/lists",  listProduct);
router.post("/create", authMiddleware, isAdmin, upload, createProduct);
router.post("/edit", authMiddleware, isAdmin, upload, updateProduct);
router.post("/delete", authMiddleware, isAdmin, deleteProduct);
export default router;
