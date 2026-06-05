import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import  Products from "../models/product.model.js";
import Categories from "../models/categorie.model.js";
import Brands from "../models/brand.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

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

    // Upload image buffer to Cloudinary
    const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            stream.end(req.file.buffer);
        });
    };

    let uploadResult;
    try {
        uploadResult = await uploadToCloudinary();
    } catch (err) {
        console.error("Cloudinary upload failed", err);
        return errorResponse(res, "Failed to upload image", StatusCodes.INTERNAL_SERVER_ERROR);
    }
    const imageUrl = uploadResult.secure_url;

    const product = await Products.create({
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
        image: imageUrl,
    });
    return successResponse(res, product, "Product created successfully");
})

export const updateProduct = asyncHandler( async (req, res) => {
    const { name, description, price, discount_price, stock, ram, storage, color, status } = req.body;
    // Prepare update fields
    const updateFields = {
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
    };
    // If a new image file is provided, upload to Cloudinary
    if (req.file) {
        const uploadToCloudinary = () => new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
            stream.end(req.file.buffer);
        });
        try {
            const uploadResult = await uploadToCloudinary();
            updateFields.image = uploadResult.secure_url;
        } catch (err) {
            console.error("Cloudinary upload failed", err);
            return errorResponse(res, "Failed to upload image", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    const product = await Products.update(updateFields, {
        where: { product_id: req.body.product_id },
    });
    return successResponse(res, product, "Product updated successfully");
});


export const deleteProduct = asyncHandler( async (req, res) => {
    const product = await Products.destroy({
        where: {
            product_id: req.body.product_id,
        },
    });
    return successResponse(res, product, "Product deleted successfully");
})