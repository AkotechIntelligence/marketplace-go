const express = require("express");
const router = express.Router();
const HomePageController = require("../controllers/HomePageController");
const ProductController = require("../controllers/ProductController");
const MarketZoneController = require("../controllers/MarketZoneController");

// Public Routes
router.get("/", HomePageController.getHomePage);
router.get("/about", HomePageController.getAbout);
router.get("/contact", HomePageController.getContact);

// Product Routes
router.get("/product/:productuuid", ProductController.getProduct);

// Market Zone Routes
router.get("/marketzone/zones/:id", MarketZoneController.renderZoneById);
router.get("/marketzone/zones/merchantcategory/:id", MarketZoneController.getPageByMerchantId);

module.exports = router;