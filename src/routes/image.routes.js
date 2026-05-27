// routes/product.routes.js
import express from "express";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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



export default router;
