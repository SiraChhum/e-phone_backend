import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import  Brands from "../models/brand.model.js";
import jwt from "jsonwebtoken";

export const createBrand = asyncHandler( async (req, res) => {
    try {
    const { brand_name } = req.body;
    const data = await Brands.create({
            brand_name,
    });
    res.json(data);
    }catch (error) {
        console.error("Error creating brands:", error);
        return errorResponse(res, "Failed to create brands", StatusCodes.INTERNAL_SERVER_ERROR);
    }
});

export const listBrand = asyncHandler(async (req, res) => {
    try {
        const data = await Brands.findAll();
        res.json(data);
    } catch (error) {
        console.error("Error fetching brands:", error);
        return errorResponse(res, "Failed to fetch brands", StatusCodes.INTERNAL_SERVER_ERROR);
    }
});