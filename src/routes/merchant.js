const express = require("express");
const router = express.Router();
const AccountPageController = require("../controllers/AccountPageController");
const { isAuthenticated } = require("../config/auth");

// Merchant Dashboard
router.get("/", isAuthenticated, AccountPageController.getHomePage);

// Merchant Shops
router.get("/shops", isAuthenticated, AccountPageController.getMerchantshops);
router.get("/shops/create", isAuthenticated, AccountPageController.renderAddMerchantShop);
router.get("/shops/:uuid/edit", isAuthenticated, AccountPageController.getMerchantShoptById);

// Merchant Products
router.get("/products", isAuthenticated, AccountPageController.getProducts);
router.get("/products/create", isAuthenticated, AccountPageController.renderAddProduct);
router.get("/products/:uuid/edit", isAuthenticated, AccountPageController.getProductsById);

module.exports = router;