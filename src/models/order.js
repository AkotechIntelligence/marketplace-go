"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'userUuid',
                targetKey: 'uuid',
                as: 'user'
            });
            Order.belongsTo(models.Merchant, {
                foreignKey: 'merchantUuid',
                targetKey: 'uuid',
                as: 'merchant'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'orderUuid',
                sourceKey: 'uuid',
                as: 'orderItems'
            });
        }
    }

    Order.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        userUuid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'User',
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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'PENDING',
            validate: {
                isIn: [['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']]
            }
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        shippingAddress: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.STRING,
            defaultValue: 'PENDING',
            validate: {
                isIn: [['PENDING', 'PAID', 'FAILED']]
            }
        },
        paymentMethod: {
            type: DataTypes.STRING
        },
        notes: {
            type: DataTypes.TEXT
        },
        currencyCode: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'GHS'
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Order'
    });

    return Order;
};
