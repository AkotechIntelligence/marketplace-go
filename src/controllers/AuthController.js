const User = require("../models");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const passport = require("passport");
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');
const bcrypt = require('bcryptjs');
const logger = require('../logger');

const Controller = {
    // User Login
    getUserLogin(req, res) {
        res.render('auth/login', {
            title: 'Login',
            layout: 'layout/auth'
        });
    },

    async loginUser(req, res, next) {
        passport.authenticate('login-user', (err, user, info) => {
            if (err) {
                logger.error('Login error:', err);
                return next(err);
            }
            if (!user) {
                req.flash('error', info.message);
                return res.redirect('/auth/user/login');
            }
            req.logIn(user, (err) => {
                if (err) {
                    logger.error('Login error:', err);
                    return next(err);
                }
                return res.redirect('/user');
            });
        })(req, res, next);
    },

    // User Registration
    getUserRegister(req, res) {
        res.render('auth/register', {
            title: 'Register',
            layout: 'layout/auth',
            data: { error: null }
        });
    },

    async registerUser(req, res) {
        try {
            const { email, password, confirmPassword, firstName, lastName } = req.body;
            
            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match');
                return res.redirect('/auth/user/register');
            }

            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                req.flash('error', 'Email already registered');
                return res.redirect('/auth/user/register');
            }

            const user = await db.User.create({
                uuid: uuidv4(),
                email,
                password,
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                type: 'user'
            });

            logger.info(`User registered successfully: ${user.uuid}`);
            req.flash('success', 'Registration successful. Please login.');
            res.redirect('/auth/user/login');
        } catch (error) {
            logger.error('Registration error:', error);
            req.flash('error', 'Registration failed');
            res.redirect('/auth/user/register');
        }
    },

    // Merchant Login
    getMerchantLogin(req, res) {
        res.render('auth/merchant-login', {
            title: 'Merchant Login',
            layout: 'layout/auth'
        });
    },

    async loginMerchant(req, res, next) {
        passport.authenticate('login-merchant', (err, merchant, info) => {
            if (err) {
                logger.error('Merchant login error:', err);
                return next(err);
            }
            if (!merchant) {
                req.flash('error', info.message);
                return res.redirect('/auth/merchant/login');
            }
            req.logIn(merchant, (err) => {
                if (err) {
                    logger.error('Merchant login error:', err);
                    return next(err);
                }
                return res.redirect('/merchant');
            });
        })(req, res, next);
    },

    // Merchant Registration
    getMerchantRegister(req, res) {
        res.render('auth/merchant-register', {
            title: 'Merchant Registration',
            layout: 'layout/auth'
        });
    },

    async registerMerchant(req, res) {
        try {
            logger.info("Register merchant request", req.body);
            const { email, password, confirmPassword, firstName, lastName, description, phoneNumber, dateOfBirth } = req.body;
            
            const existingMerchant = await db.Merchant.findOne({ where: { email } });
            if (existingMerchant) {
                req.flash('error', 'A merchant with this email already exists');
                return res.redirect('/auth/merchant/register');
            }

            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match');
                return res.redirect('/auth/merchant/register');
            }

            const merchant = await db.Merchant.create({
                uuid: uuidv4(),
                email,
                password,
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                description,
                phoneNumber,
                dateOfBirth,
                type: 'merchant'
            });
            
            logger.info("Merchant created", merchant);
            req.flash('success', 'Merchant registered successfully');
            res.redirect('/auth/merchant/login');
        } catch (error) {
            logger.error("Error registering merchant:", error);
            req.flash('error', error.message || 'An error occurred during registration');
            return res.redirect('/auth/merchant/register');
        }
    },

    // Password Reset
    forgotPasswordFormUser(req, res) {
        res.render('auth/user-forgotpassword', {
            title: 'Forgot Password',
            layout: 'layout/auth'
        });
    },

    async forgotPasswordUser(req, res) {
        try {
            const { email } = req.body;
            const user = await db.User.findOne({ where: { email } });
            
            if (!user) {
                req.flash('error', 'No account found with that email');
                return res.redirect('/auth/user/forgot-password');
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiry;
            await user.save();

            const resetUrl = `${req.protocol}://${req.get('host')}/auth/user/reset-password/${resetToken}`;
            await sendEmail({
                email: user.email,
                subject: 'Password Reset',
                message: `You requested a password reset. Click here to reset your password: ${resetUrl}`
            });

            req.flash('success', 'Password reset email sent');
            res.redirect('/auth/user/login');
        } catch (error) {
            logger.error('Password reset error:', error);
            req.flash('error', 'Error sending password reset email');
            res.redirect('/auth/user/forgot-password');
        }
    },

    forgotPasswordFormMerchant(req, res) {
        res.render('auth/merchant-forgotpassword', {
            title: 'Forgot Password',
            layout: 'layout/auth'
        });
    },

    async forgotPasswordMerchant(req, res) {
        try {
            const { email } = req.body;
            const merchant = await db.Merchant.findOne({ where: { email } });
            
            if (!merchant) {
                req.flash('error', 'No merchant account found with that email');
                return res.redirect('/auth/merchant/forgot-password');
            }

            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpiry = Date.now() + 3600000; // 1 hour

            merchant.resetPasswordToken = resetToken;
            merchant.resetPasswordExpires = resetTokenExpiry;
            await merchant.save();

            const resetUrl = `${req.protocol}://${req.get('host')}/auth/merchant/reset-password/${resetToken}`;
            await sendEmail({
                email: merchant.email,
                subject: 'Password Reset',
                message: `You requested a password reset. Click here to reset your password: ${resetUrl}`
            });

            req.flash('success', 'Password reset email sent');
            res.redirect('/auth/merchant/login');
        } catch (error) {
            logger.error('Merchant password reset error:', error);
            req.flash('error', 'Error sending password reset email');
            res.redirect('/auth/merchant/forgot-password');
        }
    },

    resetPasswordFormUser(req, res) {
        res.render('auth/user-resetpassword', {
            title: 'Reset Password',
            layout: 'layout/auth',
            token: req.params.token
        });
    },

    async resetPasswordUser(req, res) {
        try {
            const { password, confirmPassword } = req.body;
            const { token } = req.body;

            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match');
                return res.redirect(`/auth/user/reset-password/${token}`);
            }

            const user = await db.User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
                }
            });

            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired');
                return res.redirect('/auth/user/forgot-password');
            }

            user.password = await bcrypt.hash(password, 10);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();

            req.flash('success', 'Password has been reset');
            res.redirect('/auth/user/login');
        } catch (error) {
            logger.error('Password reset error:', error);
            req.flash('error', 'Error resetting password');
            res.redirect('/auth/user/forgot-password');
        }
    },

    resetPasswordFormMerchant(req, res) {
        res.render('auth/merchant-resetpassword', {
            title: 'Reset Password',
            layout: 'layout/auth',
            token: req.params.token
        });
    },

    async resetPasswordMerchant(req, res) {
        try {
            const { password, confirmPassword } = req.body;
            const { token } = req.body;

            if (password !== confirmPassword) {
                req.flash('error', 'Passwords do not match');
                return res.redirect(`/auth/merchant/reset-password/${token}`);
            }

            const merchant = await db.Merchant.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
                }
            });

            if (!merchant) {
                req.flash('error', 'Password reset token is invalid or has expired');
                return res.redirect('/auth/merchant/forgot-password');
            }

            merchant.password = await bcrypt.hash(password, 10);
            merchant.resetPasswordToken = null;
            merchant.resetPasswordExpires = null;
            await merchant.save();

            req.flash('success', 'Password has been reset');
            res.redirect('/auth/merchant/login');
        } catch (error) {
            logger.error('Merchant password reset error:', error);
            req.flash('error', 'Error resetting password');
            res.redirect('/auth/merchant/forgot-password');
        }
    },

    // Logout
    getLogout(req, res) {
        req.logout();
        res.redirect('/');
    }
};

module.exports = Controller;