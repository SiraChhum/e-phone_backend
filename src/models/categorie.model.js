import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";

const Categories = sequelize.define(
  "categories",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Categories;