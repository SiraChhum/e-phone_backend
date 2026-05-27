import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";
import Product from "./product.model.js";

const OrderItem = sequelize.define("order_items", {
  order_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'orders',
      key: 'order_id',
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'product_id',
    }
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: "order_items",
  timestamps: false,
});
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
// Association with Order is defined in orders.model.js to avoid circular dependencies

export default OrderItem;