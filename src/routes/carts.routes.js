import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  listCarts,
  getCart,
  createCart,
  deleteCart
} from "../controllers/carts.controller.js";

import {
  addItem,
  listItems,
  updateItem,
  removeItem
} from "../controllers/cart_items.controller.js";

const router = express.Router();

// Admin view of all carts
router.get("/", authMiddleware, listCarts);

// ---------------- CART ITEMS ----------------

// List all items in a cart
router.get("/:cartId/items", authMiddleware, listItems);

// Add item
router.post("/:cartId/items", authMiddleware, addItem);

// Update item
router.put("/:cartId/items/:itemId", authMiddleware, updateItem);

// Remove item
router.delete("/:cartId/items/:itemId", authMiddleware, removeItem);

// ---------------- CART ----------------

// Get cart for user
router.get("/:userId", authMiddleware, getCart);

// Create cart
router.post("/:userId", authMiddleware, createCart);

// Delete cart
router.delete("/:cartId", authMiddleware, deleteCart);

export default router;