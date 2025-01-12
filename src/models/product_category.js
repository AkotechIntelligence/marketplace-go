"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model {
        static associate(models) {
            ProductCategory.belongsTo(models.MarketZone, {
                foreignKey: 'zoneUuid',
                targetKey: 'zoneUuid'
            });
            ProductCategory.hasMany(models.ProductSubcategory, {
                foreignKey: 'productCategoryUuid',
                sourceKey: 'uuid'
            });
        }
    }

    ProductCategory.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        zoneUuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        merchantShopCategoryUuid: DataTypes.STRING,
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "ProductCategory",
        tableName: "ProductCategory"
    });

    return ProductCategory;
};