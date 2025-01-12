"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // Association with MerchantShop
            Product.belongsTo(models.MerchantShop, {
                foreignKey: 'merchantShopUuid',
                targetKey: 'uuid'
            });

            // Association with OrderItem and Order
            Product.hasMany(models.OrderItem, {
                foreignKey: 'productUuid',
                sourceKey: 'uuid',
                as: 'orderItems'
            });

            // Association with ProductCategory
            Product.belongsTo(models.ProductCategory, {
                foreignKey: 'categoryUuid',
                targetKey: 'uuid',
                as: 'category'
            });

            // Association with ProductSubcategory
            Product.belongsTo(models.ProductSubcategory, {
                foreignKey: 'subCategoryUuid',
                targetKey: 'uuid',
                as: 'subcategory'
            });

            // Association with ProductImages
            Product.hasMany(models.ProductImage, {
                foreignKey: 'productUuid',
                sourceKey: 'uuid',
                as: 'images'
            });
        }
    }

    Product.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        merchantShopUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        categoryUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        subCategoryUuid: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Product'
    });

    return Product;
};