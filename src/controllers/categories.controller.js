import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import  Categories from "../models/categorie.model.js";
import jwt from "jsonwebtoken";

export const createCategory = asyncHandler( async (req, res) => {
    try {
    const { category_name } = req.body;
    const data = await Categories.create({
            category_name,
    });
    res.json(data);
    }catch (error) {
        console.error("Error creating category:", error);
        return errorResponse(res, "Failed to create category", StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export const listCategory = asyncHandler(async (req, res) => {
  const data = await Categories.findAll();
  res.json(data);
});