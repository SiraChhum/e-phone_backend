import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import Cart from "../models/carts.model.js";
import CartItems from "../models/cart_items.model.js";
import Products from "../models/product.model.js";

import sequelize from "../config/orm.js";

/** Get all carts (admin view) */
export const listCarts = asyncHandler(async (req, res) => {
  const data = await Cart.findAll();
  res.json(data);
});

/** Get a single cart for a user */
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: CartItems,
          as: "cart_items",
          include: [
            {
              model: Products,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/** Create a new cart for a user (if not exists) */
export const createCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const existing = await Cart.findOne({ where: { user_id: userId } });
  if (existing) {
    return errorResponse(res, "Cart already exists", StatusCodes.CONFLICT);
  }
  // Direct creation without explicit transaction for simplicity
  const cart = await Cart.create({ user_id: userId });
  return successResponse(res, cart, StatusCodes.CREATED);
});

/** Delete a cart (and its items) */
export const deleteCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const t = await sequelize.transaction();
  try {
    await CartItems.destroy({ where: { cart_id: cartId }, transaction: t });
    const deleted = await Cart.destroy({ where: { cart_id: cartId }, transaction: t });
    await t.commit();
    if (!deleted) {
      return errorResponse(res, "Cart not found", StatusCodes.NOT_FOUND);
    }
    return successResponse(res, { message: "Cart deleted" }, StatusCodes.OK);
  } catch (err) {
    await t.rollback();
    return errorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
