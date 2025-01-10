const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../config/auth");

// User Dashboard
router.get("/", isAuthenticated, (req, res) => {
    res.render("page/user/dashboard", {
        title: "Dashboard",
        layout: "layout/account"
    });
});

// User Orders
router.get("/orders", isAuthenticated, (req, res) => {
    res.render("page/user/orders", {
        title: "My Orders",
        layout: "layout/account"
    });
});

// User Profile
router.get("/profile", isAuthenticated, (req, res) => {
    res.render("page/user/profile", {
        title: "My Profile", 
        layout: "layout/account"
    });
});

// User Wishlist
router.get("/wishlist", isAuthenticated, (req, res) => {
    res.render("page/user/wishlist", {
        title: "My Wishlist",
        layout: "layout/account" 
    });
});

module.exports = router;