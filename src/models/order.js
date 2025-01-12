"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            // Define associations
            Order.belongsTo(models.User, {
                foreignKey: 'userUuid',
                as: 'user'
            });
            Order.belongsTo(models.Merchant, {
                foreignKey: 'merchantUuid',
                as: 'merchant'
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: 'orderUuid',
                as: 'orderItems'
            });
        }
    }

    Order.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'uuid'
            }
        },
        merchantUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Merchant',
                key: 'uuid'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
            defaultValue: 'pending'
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
            type: DataTypes.ENUM('pending', 'paid', 'failed'),
            defaultValue: 'pending'
        },
        paymentMethod: {
            type: DataTypes.STRING
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'Order'
    });

    return Order;
};
