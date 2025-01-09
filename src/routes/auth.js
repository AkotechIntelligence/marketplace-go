const express = require("express");
const {
	isAuthenticated,
	isNotAuthenticated,
	authenticateLogin,
	authenticateRegister,
} = require("../config/auth");
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/AuthController");

const router = express.Router();
router.get("/user/login", isNotAuthenticated, AuthController.getUserLogin);
router.post("/user/login", AuthController.loginUser);
router.get("/user/register", isNotAuthenticated, AuthController.getUserRegister);
router.post("/user/register", AuthController.registerUser);

router.get("/merchant/register", isNotAuthenticated, AuthController.getMerchantRegister);
router.post("/merchant/register", AuthController.registerMerchant);
router.get("/merchant/login", isNotAuthenticated, AuthController.getMerchantLogin);
router.post("/merchant/login", AuthController.loginMerchant);
 
router.get("/logout", AuthController.getLogout);

router.get('/merchant/forgot-password', AuthController.forgotPasswordFormMerchant);
router.post('/merchant/forgot-password', AuthController.forgotPasswordMerchant);

router.get('/user/forgot-password', AuthController.forgotPasswordFormUser);
router.post('/user/forgot-password', AuthController.forgotPasswordUser);

router.get('/user/reset-password/:token', AuthController.resetPasswordFormUser);
router.post('/user/reset-password', AuthController.resetPasswordUser);

router.get('/merchant/reset-password/:token', AuthController.resetPasswordFormMerchant);
router.post('/merchant/reset-password', AuthController.resetPasswordMerchant);

module.exports = router;
