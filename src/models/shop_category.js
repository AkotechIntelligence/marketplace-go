"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ShopCategory extends Model {
        static associate(models) {
            ShopCategory.belongsTo(models.MarketZone, {
                foreignKey: 'zoneUuid',
                targetKey: 'zoneUuid'
            });
        }
    }

    ShopCategory.init({
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
        modelName: "ShopCategory",
        tableName: "ShopCategory"
    });

    return ShopCategory;
};