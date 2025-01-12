"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Username is required" },
                },
            },
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            fullName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Email is required" },
                    isEmail: { msg: "Invalid email format" }
                },
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: { msg: "Password is required" },
                },
            },
            type: {
                type: DataTypes.STRING,
                defaultValue: 'user',
                validate: {
                    isIn: [['user', 'merchant']]
                }
            },
            isAdmin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            resetPasswordExpires: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "User",
            tableName: "User",
        }
    );

    User.associate = (models) => {
        // Define associations here
    };

    User.beforeCreate(async (user, options) => {
        user.password = await bcrypt.hash(user.password, 10);
    });

    User.comparePassword = async (password, user) => {
        return await bcrypt.compare(password, user.password);
    };

    return User;
};