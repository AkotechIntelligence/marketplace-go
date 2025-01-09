"use strict";
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");
const { User, Merchant } = db.sequelize.models;

module.exports = async (passport) => {
	passport.use(
		"login-user",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			async (email, password, done) => {
				try {
					const user = await User.findOne({ where: { email }, raw: true }); 

					if (user) {
						return done(null, user);
 						
					}else{
						return done(null, false, { message: "Invalid email or password" });
					}

				} catch (error) {
					console.log("error login", error);
					done(null, false, { message: "" });
				}
			})
		
	);

	passport.use(
		"login-merchant",
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			async (email, password, done) => {
				try {
					const merchant = await Merchant.findOne({ where: { email }, raw: true });
					if (merchant) {
						return done(null, merchant);
					} else {
						return done(null, false, { message: "Invalid email or password" });
					}
				} catch (error) {
					console.log("error login", error);

					done(null, false, { message: "" });
				}
			}
		)
	);

	 

	// passas os dados para sessão
	passport.serializeUser((user, done) => {
		console.log("password seriallizerUser", user);
		done(null, user.uuid || user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findByPk(id, { raw: true })
			.then((user) => done(null, user))
			.catch((err) => {
				Merchant.findByPk(id, { raw: true })
					.then((user) => done(null, user))
					.catch((err) => done(err));
			});
	});
};
