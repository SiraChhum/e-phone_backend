import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../schemas/auth.schema.js";
import {  getOrder, listOrder,createOrderWithOrderItems,listOrderAndItems,DetailListOrderAndItems, deleteOrder, getUserOrders } from "../controllers/orders.controller.js";

// Router
const router = express.Router();

// Routes
router.post("/create",  createOrderWithOrderItems);
router.post("/delete", authMiddleware, deleteOrder);
router.post("/listAll", listOrderAndItems);
router.post("/detail", DetailListOrderAndItems);
router.post("/get", getOrder);
router.post("/lists", listOrder);
router.get("/user/:userId", authMiddleware, getUserOrders);




export default router;
