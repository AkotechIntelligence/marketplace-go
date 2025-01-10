const express = require("express");
const router = express.Router();
const isAuthenticatedMerchant = require("../middleware/isAuthenticatedMerchant");

// Dashboard
router.get("/", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/dashboard", {
        title: "Dashboard",
        layout: "layout/merchant-account",
        user: req.user
    });
});

// Shops
router.get("/shops", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/shops", {
        title: "My Shops",
        layout: "layout/merchant-account",
        user: req.user,
        shops: [] // TODO: Fetch actual shops data
    });
});

// Create Shop
router.get("/shops/create", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/create-shop", {
        title: "Create Shop",
        layout: "layout/merchant-account",
        user: req.user
    });
});

// Products
router.get("/products", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/products", {
        title: "Products",
        layout: "layout/merchant-account",
        user: req.user,
        products: [] // TODO: Fetch actual products data
    });
});

// Create Product
router.get("/products/create", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/create-product", {
        title: "Add Product",
        layout: "layout/merchant-account",
        user: req.user
    });
});

// Orders
router.get("/orders", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/orders", {
        title: "Orders",
        layout: "layout/merchant-account",
        user: req.user,
        orders: [] // TODO: Fetch actual orders data
    });
});

// Analytics
router.get("/analytics", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/analytics", {
        title: "Analytics",
        layout: "layout/merchant-account",
        user: req.user
    });
});

// Settings
router.get("/settings", isAuthenticatedMerchant, (req, res) => {
    res.render("page/merchant/settings", {
        title: "Settings",
        layout: "layout/merchant-account",
        user: req.user
    });
});

module.exports = router;