import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";
import Products from "./product.model.js";

const CartItems = sequelize.define(
  "cart_items",
  {
    cart_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cart_items",
    timestamps: false,
  }
);

CartItems.belongsTo(Products, {
  foreignKey: "product_id",
  as: "product",
});

export default CartItems;