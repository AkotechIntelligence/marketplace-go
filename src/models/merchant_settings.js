"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MerchantSettings extends Model {
        static associate(models) {
            MerchantSettings.belongsTo(models.Merchant, {
                foreignKey: 'merchantUuid',
                targetKey: 'uuid'
            });
        }
    }

    MerchantSettings.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        merchantUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Merchant',
                key: 'uuid'
            }
        },
        bankName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        swiftCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobileMoneyProvider: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mobileNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        settlementFrequency: {
            type: DataTypes.ENUM('daily', 'weekly', 'biweekly', 'monthly'),
            defaultValue: 'weekly'
        },
        minimumSettlementAmount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 100.00
        },
        settlementMethod: {
            type: DataTypes.ENUM('bank', 'mobile'),
            defaultValue: 'bank'
        }
    }, {
        sequelize,
        modelName: "MerchantSettings",
        tableName: "MerchantSettings"
    });

    return MerchantSettings;
};