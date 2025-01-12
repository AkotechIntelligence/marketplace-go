"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Merchant extends Model {
        static associate(models) {
            Merchant.hasMany(models.MerchantShop, {
                foreignKey: 'merchantUuid',
                sourceKey: 'uuid'
            });
            Merchant.hasMany(models.Order, {
                foreignKey: 'merchantUuid',
                as: 'orders'
            });
        }
    }

    Merchant.init({
        uuid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "Email is required" },
                isEmail: { msg: "Invalid email format" }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Password is required" }
            }
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'merchant',
            validate: {
                isIn: [['merchant']]
            }
        },
        phoneNumber: DataTypes.STRING,
        dateOfBirth: DataTypes.DATE,
        idCardNumber: DataTypes.STRING,
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        resetPasswordToken: DataTypes.STRING,
        resetPasswordExpires: DataTypes.DATE
    }, {
        sequelize,
        modelName: "Merchant",
        tableName: "Merchant"
    });

    Merchant.beforeCreate(async (merchant) => {
        merchant.password = await bcrypt.hash(merchant.password, 10);
    });

    return Merchant;
};