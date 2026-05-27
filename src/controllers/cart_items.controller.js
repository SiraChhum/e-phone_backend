import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import Cart from "../models/carts.model.js";
import CartItems from "../models/cart_items.model.js";
import Products from "../models/product.model.js";
import sequelize from "../config/orm.js";

/** Add an item to a specific cart (creates cart if missing) */
export const addItem = asyncHandler(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { cartId } = req.params;
    const { product_id, qty } = req.body;
    // Ensure cart exists
    let cart = await Cart.findByPk(cartId, { transaction: t });
    if (!cart) {
      return errorResponse(res, "Cart not found", StatusCodes.NOT_FOUND);
    }
    // Verify product exists and fetch price
    const product = await Products.findByPk(product_id, { transaction: t });
    if (!product) {
      return errorResponse(res, "Product not found", StatusCodes.BAD_REQUEST);
    }
    const price = product.price;
    await CartItems.create({ cart_id: cart.cart_id, product_id, qty, price }, { transaction: t });
    await t.commit();
    return successResponse(res, { message: "Item added to cart" }, StatusCodes.CREATED);
  } catch (err) {
    await t.rollback();
    return errorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

/** List all items in a cart */
export const listItems = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const items = await CartItems.findAll({
    where: { cart_id: cartId },
    include: [{ model: Products, as: "products" }],
  });
  return successResponse(res, items, StatusCodes.OK);
});

/** Update quantity of a cart item */
export const updateItem = asyncHandler(async (req, res) => {
  const { cartId, itemId } = req.params;
  const { qty } = req.body;
  const item = await CartItems.findOne({ where: { cart_item_id: itemId, cart_id: cartId } });
  if (!item) {
    return errorResponse(res, "Cart item not found", StatusCodes.NOT_FOUND);
  }
  item.qty = qty;
  await item.save();
  return successResponse(res, { message: "Item quantity updated" }, StatusCodes.OK);
});

/** Remove an item from a cart */
export const removeItem = asyncHandler(async (req, res) => {
  const { cartId, itemId } = req.params;
  const deleted = await CartItems.destroy({ where: { cart_item_id: itemId, cart_id: cartId } });
  if (!deleted) {
    return errorResponse(res, "Cart item not found", StatusCodes.NOT_FOUND);
  }
  return successResponse(res, { message: "Item removed" }, StatusCodes.OK);
});
