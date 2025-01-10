const express = require("express");
const router = express.Router();
const isAuthenticatedUser = require("../middleware/isAuthenticatedUser");

// Dashboard
router.get("/", isAuthenticatedUser, (req, res) => {
    res.render("page/user/dashboard", {
        title: "Dashboard",
        layout: "layout/user-account",
        user: req.user
    });
});

// Orders
router.get("/orders", isAuthenticatedUser, (req, res) => {
    res.render("page/user/orders", {
        title: "My Orders",
        layout: "layout/user-account",
        user: req.user,
        orders: [] // TODO: Fetch actual orders data
    });
});

// Wishlist
router.get("/wishlist", isAuthenticatedUser, (req, res) => {
    res.render("page/user/wishlist", {
        title: "My Wishlist",
        layout: "layout/user-account",
        user: req.user,
        wishlist: [] // TODO: Fetch actual wishlist data
    });
});

// Profile
router.get("/profile", isAuthenticatedUser, (req, res) => {
    res.render("page/user/profile", {
        title: "My Profile",
        layout: "layout/user-account",
        user: req.user
    });
});

// Addresses
router.get("/addresses", isAuthenticatedUser, (req, res) => {
    res.render("page/user/addresses", {
        title: "My Addresses",
        layout: "layout/user-account",
        user: req.user,
        addresses: [] // TODO: Fetch actual addresses data
    });
});

// Settings
router.get("/settings", isAuthenticatedUser, (req, res) => {
    res.render("page/user/settings", {
        title: "Account Settings",
        layout: "layout/user-account",
        user: req.user
    });
});

module.exports = router;