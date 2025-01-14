"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductOption extends Model {}

    ProductOption.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        merchantUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        shopUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        optionName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "ProductOption",
        tableName: "ProductOption"
    });

    return ProductOption;
};