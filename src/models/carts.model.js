import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";
import CartItems from "./cart_items.model.js";

const Cart = sequelize.define(
  "carts",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "carts",
    timestamps: true,
  }
);
Cart.hasMany(CartItems, {
  foreignKey: "cart_id",
  as: "cart_items",
});
export default Cart;