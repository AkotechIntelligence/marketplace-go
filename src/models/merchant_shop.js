"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class MerchantShop extends Model {
        static associate(models) {
            MerchantShop.




						belongsTo(models.Merchant, {
                foreignKey: 'merchantUuid',
                targetKey: 'uuid',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            MerchantShop.belongsTo(models.MarketZone, {
                foreignKey: 'zoneUuid',
                targetKey: 'zoneUuid',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
            });
            MerchantShop.belongsTo(models.MerchantShopCategory, {
                foreignKey: 'merchantShopCategoryUuid',
                targetKey: 'uuid',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE'
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
            allowNull: false,
            unique: true
        },
        description: DataTypes.STRING,
        zoneUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'MarketZone',
                key: 'zoneUuid'
            }
        },
        merchantShopCategoryUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'MerchantShopCategory',
                key: 'uuid'
            }
        },
        merchantUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Merchant',
                key: 'uuid'
            }
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
