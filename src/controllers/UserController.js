const { User } = require("../models");
// import AppGlobalData from "../app.global.data";

// Rotas GET


const getIndex = async (req, res) => {
	//res.locals.user = { name: "John", email: "john@example.com" };
	// res.locals.categories = AppGlobalData.categories;
	// res.locals.zones = AppGlobalData.zones;

	// console.log("AppGlobalData.categories", AppGlobalData.categories);
	// console.log("AppGlobalData.zones", AppGlobalData.zones);

	res.render("page", { session: false });
};

const getAbout = (req, res) => {
	res.render("page/about");
};

const getContact = (req, res) => {
	res.render("page/contact");
};

const getAuth = (req, res) => {
	res.render("page/auth");
};

const getLogout = (req, res) => {
	req.logout();
	res.redirect("/"); // ADD rota depois do logout
};

module.exports = {
	getIndex,
	getAbout,
	getContact,
	getAuth,
	getLogout,
};
