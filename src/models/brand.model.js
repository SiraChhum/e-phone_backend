import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";

const Brands = sequelize.define(
  "brands",
  {
    brand_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    brand_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
        timestamps: true,
    createdAt: "createdAt",
  }
);

export default Brands;