import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import productRoutes from "./routes/product.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import passport from "../config/passport.js";
import imageRoutes from "./routes/image.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import cartRoutes from "./routes/carts.routes.js";

// Create Express app
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); //  must come before routes

// const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : ["http://localhost:5173"];
app.use(
  cors({
    origin: "http://localhost:5173", ////// frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
// Apply middlewares
app.use(helmet());

app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/carts", cartRoutes)
app.use("/api/image", imageRoutes);

// Root route
// app.get("/", (req, res) => {
//   res.status(StatusCodes.OK).json({
//     message: "API E-Store is running",
//     version: "1.0.0",
//   });
// });
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API E-Store is running",
    version: "1.0.0",
  });
});

// Not found middleware
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Resource not found",
  });
});

// Error handling middleware
app.use(errorHandler);

//
app.use(passport.initialize());

export default app;
