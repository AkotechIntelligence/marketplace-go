"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Merchant extends Model {}

    Merchant.init(
        {
            uuid: {
                type: DataTypes.STRING,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            fullName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Email is required" },
                    isEmail: { msg: "Invalid email format" }
                }
            },
            password: {
                type: DataTypes.STRING,
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
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            resetPasswordToken: DataTypes.STRING,
            resetPasswordExpires: DataTypes.DATE
        },
        {
            sequelize,
            modelName: "Merchant",
            tableName: "Merchants"
        }
    );

    Merchant.beforeCreate(async (merchant, options) => {
        merchant.password = await bcrypt.hash(merchant.password, 10);
    });

    Merchant.comparePassword = async (password, merchant) => {
        return await bcrypt.compare(password, merchant.password);
    };

    return Merchant;
};