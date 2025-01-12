"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductField extends Model {
        static associate(models) {
            ProductField.belongsTo(models.Product, {
                foreignKey: 'productUuid',
                targetKey: 'uuid'
            });
        }
    }

    ProductField.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        fieldName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fieldValue: {
            type: DataTypes.STRING,
            allowNull: false
        },
       fieldType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        productUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fieldLabel: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "ProductField",
        tableName: "ProductField"
    });

    return ProductField;
};