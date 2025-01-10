"use strict";
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models");
const logger = require("../logger");

module.exports = async (passport) => {
    // User Login Strategy
    passport.use("login-user", new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                logger.info(`Attempting user login for email: ${email}`);
                const user = await db.User.findOne({ where: { email }, raw: true });

                if (!user) {
                    logger.warn(`Login failed: No user found with email ${email}`);
                    return done(null, false, { message: "Invalid email or password" });
                }
 
                // Add user type to the user object
                user.type = 'user';
                logger.info(`User login successful: ${email}`);
                return done(null, user);
            } catch (error) {
                logger.error(`Error during user login: ${error.message}`, { error });
                return done(error);
            }
        }
    ));

    // Merchant Login Strategy
    passport.use("login-merchant", new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                logger.info(`Attempting merchant login for email: ${email}`);
                const merchant = await db.Merchant.findOne({ where: { email }, raw: true });

                if (!merchant) {
                    logger.warn(`Login failed: No merchant found with email ${email}`);
                    return done(null, false, { message: "Invalid email or password" });
                }

                
                // Add user type to the merchant object
                merchant.type = 'merchant';
                logger.info(`Merchant login successful: ${email}`);
                return done(null, merchant);
            } catch (error) {
                logger.error(`Error during merchant login: ${error.message}`, { error });
                return done(error);
            }
        }
    ));

    // Serialize user/merchant
    passport.serializeUser((user, done) => {
        logger.debug(`Serializing user: ${user.email}, type: ${user.type}`);
        done(null, { id: user.uuid || user.id, type: user.type });
    });

    // Deserialize user/merchant based on type
    passport.deserializeUser(async ({ id, type }, done) => {
        try {
            logger.debug(`Deserializing ${type} with id: ${id}`);
            let user;

            if (type === 'user') {
                user = await db.User.findByPk(id, { raw: true });
                if (user) user.type = 'user';
            } else if (type === 'merchant') {
                user = await db.Merchant.findByPk(id, { raw: true });
                if (user) user.type = 'merchant';
            }

            if (!user) {
                logger.warn(`Failed to deserialize ${type} with id: ${id}`);
                return done(new Error(`${type} not found`));
            }

            logger.debug(`Successfully deserialized ${type}: ${user.email}`);
            done(null, user);
        } catch (error) {
            logger.error(`Error deserializing ${type}: ${error.message}`, { error });
            done(error);
        }
    });
};