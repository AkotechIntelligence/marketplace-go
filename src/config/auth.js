"use strict";
const passport = require("passport");

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	return res.redirect("/login"); // ADD rota de retorno caso não autenticado
};

const isNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) return next();
	return res.redirect("/auth"); // ADD rota de retorno caso não autenticado
};

const authenticateLogin = passport.authenticate("local-login", {
	successRedirect: "/", // ADD rota de successo no login
	failureRedirect: "/login", // ADD rota de falha no login
});

const authenticateRegister = passport.authenticate("local-register", {
	successRedirect: "/", // ADD rota de successo no register
	failureRedirect: "/register", // ADD rota de falha no register
});

module.exports = {
	isAuthenticated,
	isNotAuthenticated,
	authenticateLogin,
	authenticateRegister,
};
