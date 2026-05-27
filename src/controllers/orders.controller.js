import { asyncHandler } from "../utils/helpers.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { StatusCodes } from "http-status-codes";
import Order from "../models/orders.model.js";
import OrderItems from "../models/order_items.model.js";
// import sequelize from '../../src/config/orm.js';
import Users from "../models/users.model.js";
import Products from "../models/product.model.js";
import sequelize from "../config/orm.js";
import { body } from "express-validator";


//list 
export const getOrder = asyncHandler(async (req, res) => {
  // Assuming listUsers is defined in the model
  const id = req.body.id;
  const data = await Order.findByPk( id);  
  res.json(data);
});

export const listOrder = asyncHandler(async (req, res) => {
  // Assuming listUsers is defined in the model
  const data = await Order.findAll();
  console.log("BACKEND DATA:", data);
res.json(data);
});

export const createOrderWithOrderItems = asyncHandler(async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, order_status, order_items } = req.body;

    // Calculate total amount from items
    const calculatedTotal = order_items.reduce((sum, item) => {
      return sum + (item.price * item.qty);
    }, 0);

    const createOrder = await Order.create(
      {
        user_id,
        total_amount: calculatedTotal,
        order_status: order_status || "PENDING",
      },
      { transaction: t }
    );

    for (const { product_id, product_name, qty, price } of order_items) {
      const dataItems = {
        order_id: createOrder.order_id,
        product_id,
        product_name,
        qty,
        price,
        subtotal: price * qty
      };
      await OrderItems.create(dataItems, { transaction: t });
    }

    await t.commit();

    return res.status(StatusCodes.CREATED).json({
      order_id: createOrder.order_id,
    });
  } catch (err) {
    await t.rollback();
    console.error("ORDER ERROR:", err.message);
    return errorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

export const listOrderAndItems = asyncHandler(async (req, res) => {
  const data = await Order.findAll({
    order: [["order_id", "DESC"]],
    attributes: [
      "order_id",
      "user_id",
      "total_amount",
      "status",
      "created_at",
    ],
    include: [
      {
        model: Users,
        as: 'users',       // make sure this alias matches your association
        attributes: ['username']  // user_name
      },
      {
        model: OrderItems,
        as: 'order_items', //  must match .hasMany(orderItems, { as: 'order_items' })
        attributes: ["product_id", "quantity", "price", "subtotal"],
        include: [
          {
            model: Products,
            as: 'product',   // make sure this alias matches your association
            attributes: ['name']  // product_name
          }
        ]
      }
    ]
  });
  console.log("BACKEND DATA:", data);
  res.json(data);
});
export const DetailListOrderAndItems = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const data = await Order.findOne({
    where: { order_id: id },
    attributes: [
      "order_id",
      "user_id",
      "total_amount",
      "status",
    ],
    include: [
      {
        model: Users,
        as: 'users',       // make sure this alias matches your association
        attributes: ['username']  // user_name
      },
      {
        model: OrderItems,
        as: 'order_items', // 👈 must match .hasMany(orderItems, { as: 'order_items' })
        attributes: ['product_id', 'quantity', 'price', 'subtotal'],
        include: [
          {
            model: Products,
            as: 'product',   // make sure this alias matches your association
            attributes: ['name']  // product_name
          }
        ]
      }
    ]
  });
  res.json(data);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const data = await Order.findAll({
    where: { user_id: userId },
    order: [["order_id", "DESC"]],
    attributes: [
      "order_id",
      "user_id",
      "total_amount",
      "order_status",
      "createdAt",
    ],
    include: [
      {
        model: OrderItems,
        as: 'order_items', 
        attributes: ['product_id', 'product_name', 'qty', 'price', 'subtotal'],
        include: [
          {
            model: Products,
            as: 'product',
            attributes: ['name', 'image']
          }
        ]
      }
    ]
  });
  res.json(data);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const deleted = await Order.destroy({ where: { order_id: id } });
  if (!deleted) {
    return errorResponse(res, "Order not found", StatusCodes.NOT_FOUND);
  }
  res.json({ message: "Order deleted successfully", deleted });
});
