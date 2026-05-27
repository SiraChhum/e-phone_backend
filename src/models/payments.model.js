import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";

const Payment = sequelize.define(
  "payments", 
  {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  payment_status: {
    type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
    defaultValue: "PENDING",
  },
  paid_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "payments",
  timestamps: false,
});

// Association with Order is defined in orders.model.js to avoid circular dependencies

export default Payment;