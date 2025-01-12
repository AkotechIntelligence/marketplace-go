"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: 'orderUuid',
                as: 'order'
            });
            OrderItem.belongsTo(models.Product, {
                foreignKey: 'productUuid',
                as: 'product'
            });
            
        }
    }

    OrderItem.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        orderUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'uuid'
            }
        },
        productUuid: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'uuid'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        currencyCode: {
            type: DataTypes.STRING(3),
            allowNull: false,
            defaultValue: 'GHS'
            
        },
        orderDetail: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Stores the complete product fields at time of order'
        }
    }, {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'OrderItem'
    });

    return OrderItem;
};