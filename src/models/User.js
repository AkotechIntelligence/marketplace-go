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
					notEmpty: { msg: "" }, // ADD mensagem de erro
				},
			},
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			fullName: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: "" }, // ADD mensagem de erro
				},
			},
			password: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: { msg: "" }, // ADD mensagem de erro
				},
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
			tableName: "Users",
		}
	);

	User.associate = (models) => {
		/** define association here */
	};

	User.beforeCreate(async (user, options) => {
 		user.password = await bcrypt.hash(user.password, 10);
 	});

	User.comparePassword = async (password, user) => {
		return await bcrypt.compare(password,user.password);
	};

	return User;
};
