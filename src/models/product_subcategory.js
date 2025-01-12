"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductSubcategory extends Model {
        static associate(models) {
            ProductSubcategory.belongsTo(models.ProductCategory, {
                foreignKey: 'productCategoryUuid',
                targetKey: 'uuid'
            });
        }
    }

    ProductSubcategory.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        productCategoryUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "ProductSubcategory",
        tableName: "ProductSubcategory"
    });

    return ProductSubcategory;
};