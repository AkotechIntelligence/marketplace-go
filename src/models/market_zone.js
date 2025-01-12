"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MarketZone extends Model {
        static associate(models) {
            MarketZone.hasMany(models.MerchantShop, {
                foreignKey: 'zoneUuid',
                sourceKey: 'zoneUuid'
            });
        }
    }

    MarketZone.init({
        uuid: {
            type: DataTypes.STRING,
            allowNull: false
        },
        zoneUuid: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: "MarketZone",
        tableName: "MarketZone"
    });

    return MarketZone;
};