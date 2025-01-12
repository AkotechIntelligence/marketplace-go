"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MerchantShopCategory extends Model {
        static associate(models) {
            MerchantShopCategory.belongsTo(models.MarketZone, {
                foreignKey: 'zoneUuid',
                targetKey: 'zoneUuid'
            });
            MerchantShopCategory.hasMany(models.MerchantShop, {
                foreignKey: 'merchantShopCategoryUuid',
                sourceKey: 'uuid'
            });
            MerchantShopCategory.hasMany(models.ProductCategory, {
                foreignKey: 'merchantShopCategoryUuid',
                sourceKey: 'uuid'
            });
        }
    }

    MerchantShopCategory.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        zoneUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING,
        icon: DataTypes.STRING
    }, {
        sequelize,
        modelName: "MerchantShopCategory",
        tableName: "MerchantShopCategory"
    });

    return MerchantShopCategory;
};