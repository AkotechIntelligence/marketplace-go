const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	const Merchant = sequelize.define(
		"Merchant",
		{
			 
			uuid: {
				type: DataTypes.STRING,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			firstName: DataTypes.STRING,
			lastName: DataTypes.STRING,
			fullName: DataTypes.STRING,
			dateOfBirth: DataTypes.STRING,
			email: DataTypes.STRING,
			password: {
				type: DataTypes.STRING,
				 
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			phoneNumber: DataTypes.STRING,
			idCardNumber: DataTypes.STRING,
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			resetPasswordToken: DataTypes.STRING,
			resetPasswordExpires: DataTypes.DATE,
		},
		{
			tableName: "Merchant",
		}
	);

	Merchant.beforeCreate(async (user, options) => {
		user.password = await bcrypt.hash(user.password, 10);
		
	});

	Merchant.comparePassword = async (password, user) => {
		return await bcrypt.compare(password, user.password);
	};

	return Merchant;
};
