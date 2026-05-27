import { DataTypes } from "sequelize";
import sequelize from "../config/orm.js";

// Users table
const Users = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
      image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
      email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true, // null for Google OAuth users
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM("CUSTOMER", "ADMIN"),
      defaultValue: "CUSTOMER",
    },
  google_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  google_access_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  google_refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
        date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
      address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
        gender: {
      type: DataTypes.ENUM("MALE", "FEMALE", "OTHER"),
      allowNull: true,
    },


    status: {
      type: DataTypes.ENUM("ACTIVE", "INACTIVE", "BANNED"),
      defaultValue: "ACTIVE",
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    
  }
);

export default Users;