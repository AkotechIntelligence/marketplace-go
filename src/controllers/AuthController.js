const User = require("../models/User");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');
const Merchant = require("../models/m_merchant");
const passport = require("passport");
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');
const bcrypt = require('bcryptjs');
const Controller = {};


Controller.getUserLogin = (req, res) => {
	res.render("auth/login", {
		title: "Login Page",
		layout: "layout/auth",
	});
};

Controller.getUserRegister = (req, res) => {
	//res.locals.zones = AppGlobalData.zones;
	req.flash('error', '');
	res.render("auth/register", {
		title: "Login Page",
		layout: "layout/auth",
		messages: req.flash(),
		error:"",
		data:{error:""}
	});
};


Controller.getMerchantLogin = (req, res) => {
	res.render("auth/merchant-login", {
		title: "Merchant Login",
		layout: "layout/auth",
		messages: req.flash() // Add this line to pass flash messages to the view
	});
};

Controller.getMerchantRegister = async (req, res) => {
	const marketZones = await db.MarketZones.findAll({ raw: true });
	const shopCategories = await db.MerchantShopCategory.findAll({ raw: true });
	res.render("auth/merchant-register", {
		title: "Merchant Registration",
		layout: "layout/auth",
		marketZones,
		shopCategories,
		messages: req.flash() // Add this line to pass flash messages to the view
	});
};

Controller.loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await db.User.findOne({ where: { email }, raw: true });
		if (user && db.User.comparePassword(password, user)) {
			const returnUrl = req.body.returnUrl || req.query.returnUrl || "/";
			return passport.authenticate("login-user", {
				successRedirect: returnUrl,
				failureRedirect: "/auth/user/login", // ADD rota de falha no login
				failureFlash: true,
				failureMessage: "Invalid Email or password",
			})(req, res);
		}else{
			req.flash('error', 'Invalid email or password');
			return res.redirect('/auth/user/login');
		}	// If no user found or password incorrect

	} catch (error) {
		console.error("Login error:", error);
		req.flash('error', error.message || 'An error occurred during login');
		return res.redirect('/auth/user/login');
 	}
}

Controller.loginMerchant = async (req, res) => {
	console.log("Login merchant request", req.body);
	const { email, password } = req.body;
	try {
		const merchant = await db.Merchant.findOne({ where: { email }, raw: true });
		if (merchant && db.Merchant.comparePassword(password, merchant)) {
			const returnUrl = req.body.returnUrl || req.query.returnUrl || "/";
			return passport.authenticate("login-merchant", {
				successRedirect: returnUrl,
				failureRedirect: "/auth/merchant/login", // ADD rota de falha no login
				failureFlash: true,
				failureMessage: "Invalid Email or password",
			})(req, res);
		}else{
			req.flash('error', 'Invalid email or password');
			return res.redirect('/auth/merchant/login');
		}

	} catch (error) {
		console.error("Login error:", error);
		req.flash('error', error.message || 'An error occurred during login');
		return res.redirect('/auth/merchant/login');
 	}
}

Controller.registerUser = async (req, res) => {
	try {
		// Check if user already exists
		const existingUser = await db.User.findOne({ where: { email: req.body.email } });
		if (existingUser) {
			return res.render('auth/register', {
				error: 'A user with this email already exists',
				layout: 'layout/auth'
			});
		}

		if (req.body.password !== req.body.confirmPassword) {
			return res.render('page/register', {
				error: 'Passwords do not match',
				layout: 'layout/auth'
			});
		}

		const userData = {
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password,
 			fullName: `${req.body.firstName} ${req.body.lastName}`
		}

		const user = await db.User.create(userData);
		console.log("User created", user);
		req.flash('success', 'User registered successfully');
		res.redirect('/auth/user/login');
	} catch (error) {
		console.error("Error registering user:", error);
		res.render('page/register', {
			error: error.message || 'An error occurred during registration',
			layout: 'layout/auth'
		});
	}
}

Controller.registerMerchant = async (req, res) => {
	try {
		const marketZones = await db.MarketZones.findAll({ raw: true });
		const shopCategories = await db.MerchantShopCategory.findAll({ raw: true });
		console.log("Register merchant request", req.body);
		const { email, password, username, confirmPassword, type } = req.body;
		// Check if merchant already exists
		const existingMerchant = await db.Merchant.findOne({ where: { email } });
		if (existingMerchant) {
			req.flash('error', 'A merchant with this email already exists');
			return res.redirect('/auth/merchant/register');
		}
		if (password !== confirmPassword) {
			return res.render('auth/merchant-register', {
				error: 'Passwords do not match',
				layout: 'layout/auth',
				marketZones,
				shopCategories
			});
		}

		const merchantData = {
			email: req.body.email,
			password: req.body.password,
			shopName: req.body.shopName,
			phoneNumber: req.body.phoneNumber,
			firstName:req.body.firstName,
			lastName:req.body.lastName,
			fullName: `${req.body.firstName} ${req.body.lastName}`,
			dateOfBirth: req.body.dateOfBirth,
		}
		const merchant = await db.Merchant.create(merchantData);
        const merchantShopData ={
			uuid: uuidv4(),
			shopName: req.body.shopName,
			description: req.body.description,
			zoneUuid: req.body.zoneUuid,
			merchantUuid: merchant.uuid,
		}
        const merchantShop = await db.MerchantShop.create(merchantShopData);
		//redirect to login
		console.log("Merchant created", merchant);
		console.log("Merchant shop created", merchantShop);
		req.flash('success', 'Merchant registered successfully');
		res.redirect('/auth/merchant/login');
	} catch (error) {
		console.error("Error registering merchant:", error);
		req.flash('error', error.message || 'An error occurred during registration');
		return res.redirect('/auth/merchant/register');
	}
}

Controller.forgotPasswordMerchant = async (req, res) => {
	try {
		const { email } = req.body;
		const merchant = await db.Merchant.findOne({ where: { email } });

		if (!merchant) {
			req.flash('error', 'No account with that email address exists.');
			return res.redirect('/auth/merchant/forgot-password');
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

		await merchant.update({
			resetPasswordToken: resetToken,
			resetPasswordExpires: resetTokenExpiry
		});

		// Send email
		const resetUrl = `http://${req.headers.host}/auth/merchant/reset-password/${resetToken}`;
		const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
			Please click on the following link, or paste this into your browser to complete the process:\n\n
			${resetUrl}\n\n
			If you did not request this, please ignore this email and your password will remain unchanged.`;

		await sendEmail({
			email: merchant.email,
			subject: 'Password Reset',
			message
		});

		req.flash('success', 'An e-mail has been sent to ' + merchant.email + ' with further instructions.');
		res.redirect('/auth/merchant/login');
	} catch (error) {
		console.error('Error in forgot password:', error);
		req.flash('error', 'An error occurred. Please try again.');
		res.redirect('/auth/merchant/forgot-password');
	}
};

Controller.getLogout = (req, res) => {
	req.logout();
	res.redirect("/"); // ADD rota depois do logout
};

Controller.forgotPasswordFormMerchant = (req, res) => {
	res.render('page/merchant-forgotpassword', { layout: 'layout/auth' });
};

Controller.forgotPasswordUser = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user) {
			req.flash('error', 'No account with that email address exists.');
			return res.redirect('/auth/user/forgot-password');
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString('hex');
		const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

		await user.update({
			resetPasswordToken: resetToken,
			resetPasswordExpires: resetTokenExpiry
		});

		// Send email
		const resetUrl = `http://${req.headers.host}/auth/user/reset-password/${resetToken}`;
		const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
			Please click on the following link, or paste this into your browser to complete the process:\n\n
			${resetUrl}\n\n
			If you did not request this, please ignore this email and your password will remain unchanged.`;

		await sendEmail({
			email: user.email,
			subject: 'Password Reset',
			message
		});

		req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
		res.redirect('/auth/user/login');
	} catch (error) {
		console.error('Error in forgot password:', error);
		req.flash('error', 'An error occurred. Please try again.');
		res.redirect('/auth/user/forgot-password');
	}
};

Controller.forgotPasswordFormUser = (req, res) => {
	res.render('auth/user-forgotpassword', {
		title: "Forgot Password",
		layout: 'layout/auth'
	});
};

Controller.resetPasswordFormUser = async (req, res) => {
    const { token } = req.params;
    res.render('auth/user-resetpassword', {
        title: "Reset Password",
        layout: 'layout/auth',
        token
    });
};

Controller.resetPasswordUser = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match');
            return res.redirect(`/auth/user/reset-password/${token}`);
        }

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [db.Sequelize.Op.gt]: Date.now() }
            }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/auth/user/forgot-password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        req.flash('success', 'Your password has been updated');
        res.redirect('/auth/user/login');
    } catch (error) {
        console.error('Error resetting user password:', error);
        req.flash('error', 'An error occurred while resetting your password');
        res.redirect('/auth/user/forgot-password');
    }
};

Controller.resetPasswordFormMerchant = async (req, res) => {
    const { token } = req.params;
    res.render('auth/merchant-resetpassword', {
        title: "Reset Merchant Password",
        layout: 'layout/auth',
        token
    });
};

Controller.resetPasswordMerchant = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

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

        const hashedPassword = await bcrypt.hash(password, 10);
        await merchant.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        req.flash('success', 'Your password has been updated');
        res.redirect('/auth/merchant/login');
    } catch (error) {
        console.error('Error resetting merchant password:', error);
        req.flash('error', 'An error occurred while resetting your password');
        res.redirect('/auth/merchant/forgot-password');
    }
};




module.exports = Controller ;
