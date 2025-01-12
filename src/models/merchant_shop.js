"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MerchantShop extends Model {
        static associate(models) {
            MerchantShop.belongsTo(models.Merchant, {
                foreignKey: 'merchantUuid',
                targetKey: 'uuid'
            });
            MerchantShop.belongsTo(models.MarketZone, {
                foreignKey: 'zoneUuid',
                targetKey: 'zoneUuid'
            });
            MerchantShop.hasMany(models.Product, {
                foreignKey: 'merchantShopUuid',
                sourceKey: 'uuid'
            });
        }
    }

    MerchantShop.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        shopName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        zoneUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        merchantShopCategoryUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        merchantUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: "MerchantShop",
        tableName: "MerchantShop"
    });

    return MerchantShop;
};