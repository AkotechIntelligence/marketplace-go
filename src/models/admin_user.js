"use strict";
const { Model } = require("sequelize");
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	class AdminUser extends Model {}
	AdminUser.init(
		{
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
			roles: {
				type: DataTypes.JSONB, //array of roles
				defaultValue: false,
			}
		},
		{
			sequelize,
			modelName: "AdminUser",
			tableName: "admin_users",
		}
	);

	AdminUser.associate = (models) => {
		/** define association here */
	};

	AdminUser.beforeCreate(async (user, options) => {
 		user.password = await bcrypt.hash(user.password, 10);
 	});

	AdminUser.comparePassword = async (password, user) => {
		return await bcrypt.compare(password,user.password);
	};

	return User;
};
