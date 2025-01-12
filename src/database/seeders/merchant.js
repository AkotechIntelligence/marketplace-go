const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');

const Merchant = [
	{
		uuid: uuidv4(),
		firstName: "Nana",
		lastName: "Nimo",
		fullName: "Nana Nimo",
		dateOfBirth: "1993-06-03",
		email: "merchant@example.com",
		password: bcrypt.hashSync("password123", 10),
		phoneNumber: "2335893758",
		idCardNumber: "ID123456",
		type: "merchant"
	},
];

module.exports = Merchant;