import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { login, me, deleteUser, getUsers, listUsers, createUser, updateUser, googleAuthRedirect, googleAuthCallback } from "../controllers/auth.controller.js";

// Setup router
const router = express.Router();

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/users")); // use absolute path
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const uploadDir = path.join(__dirname, "../uploads/users");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

//  Initialize upload middleware with file size limit (1MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
}).single("image");

// ✅ Routes
router.post("/login", validate(loginSchema), login);
router.post("/create", upload, createUser);
router.post("/delete", authMiddleware, isAdmin, deleteUser);
router.post("/get", authMiddleware, isAdmin, getUsers);
router.post("/lists", authMiddleware, isAdmin, listUsers);
router.post("/update", authMiddleware, isAdmin, upload, updateUser);

// ✅ Google OAuth routes
router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);

export default router;
