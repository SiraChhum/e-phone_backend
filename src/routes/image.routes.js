// routes/product.routes.js
import express from "express";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Go up two levels to project root (from src/routes to e-store_backend)
const rootDir = resolve(__dirname, '../../');

router.get('/product/:image', (req, res) => {
  res.sendFile(resolve(rootDir, 'src/uploads/products', req.params.image));
});
router.get('/categories/:image', (req, res) => {
  res.sendFile(resolve(rootDir, 'src/uploads/categories', req.params.image));
});

/* ------------------- Cloudinary Upload ------------------- */
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  try {
    const uploadResult = await new Promise((resolveUpload, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolveUpload(result);
        }
      ).end(req.file.buffer);
    });

    res.json({ url: uploadResult.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});
/* ------------------------------------------------------ */

export default router;
