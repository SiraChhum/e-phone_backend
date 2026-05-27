import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";
import Users from "./users.model.js";
import OrderItems from "./order_items.model.js";
import Payment from "./payments.model.js";

const Order = sequelize.define("orders", {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'user_id',
    }
  },
  payment_method: {
    type: DataTypes.STRING,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  order_status: {
    type: DataTypes.ENUM("PENDING", "PAID", "CANCELLED"),
    defaultValue: "PENDING",
  },
}, {
  tableName: "orders",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: false,
});
Order.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
Order.hasMany(OrderItems, { foreignKey: 'order_id', as: 'order_items' });
OrderItems.belongsTo(Order, { foreignKey: 'order_id', as: 'orders' });

Order.hasMany(Payment, { foreignKey: 'order_id', as: 'payments' });
Payment.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

export default Order;