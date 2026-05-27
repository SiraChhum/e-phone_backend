import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import  Products from "../models/product.model.js";
import Categories from "../models/categorie.model.js";
import Brands from "../models/brand.model.js";
import jwt from "jsonwebtoken";

export const listProduct = asyncHandler( async (req, res) => {
    const product = await Products.findAll({
        include: [
            { model: Categories,
                attributes: ["category_id","category_name"],
            }
        ],
    });
    res.json(product)
})

export const createProduct = asyncHandler( async (req, res) => {
    const { name, description, price, discount_price, stock, ram, storage, color, status } = req.body;
    console.log("Uploaded file:", req.file);

    // If upload middleware didn't provide a file, return a helpful error
    if (!req.file) {
        return errorResponse(
            res,
            "Image file is required. Send multipart/form-data with field 'image'.",
            StatusCodes.BAD_REQUEST
        );
    }

    const image = req.file.filename;

    const product = await Products.create(
        {
            name,
            category_id: req.body.category_id,
            brand_id: req.body.brand_id,
            description,
            price,
            discount_price,
            stock,
            ram,
            storage,
            color,
            status,
            image,
        }
    );
    return successResponse(res, product, "Product created successfully");
})