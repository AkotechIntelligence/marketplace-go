"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Currency extends Model {
        static associate(models) {
            // No associations
        }
    }

    Currency.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        code: {
            type: DataTypes.STRING(3),
            allowNull: false,
            unique: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dollarExchangeRate: {
            type: DataTypes.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 1.0000
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        sequelize,
        modelName: "Currency",
        tableName: "Currency"
    });

    return Currency;
};