import {DataTypes} from 'sequelize';
import sequelize from '../config/orm.js';
import Categories from './categorie.model.js';
import Brands from './brand.model.js';

// Product table
const Products = sequelize.define(
    "products",
    {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories",
                key: "category_id",
            },
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "brands",
                key: "brand_id",
            },
        },
        name: {
        type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            unique: true,
            },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        discount_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ram: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        storage: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.TEXT,
            allowNull:true,
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE",
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        
    },
  {
    timestamps: true,
    createdAt: "createdAt",
  }
)
Categories.hasMany(Products, {
    foreignKey: "category_id",
});

Brands.hasMany(Products, {
    foreignKey: "brand_id",
});

Products.belongsTo(Categories, {
    foreignKey: "category_id",
});

Products.belongsTo(Brands, {
    foreignKey: "brand_id",
});
export default Products;