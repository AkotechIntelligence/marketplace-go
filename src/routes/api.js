const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const MarketZoneController = require("../controllers/MarketZoneController");
const MerchantController = require("../controllers/merchants/MerchantController");
const MerchantShopController = require("../controllers/merchants/MerchantShopController");
const MerchantShopCategoryController = require("../controllers/MerchantShopCategoryController");
const ProductController = require("../controllers/ProductController");
const ProductCategoryController = require("../controllers/ProductCategoryController");
const ProductSubCategoryController = require("../controllers/ProductSubCategoryController");
const isAdmin = require("../middleware/admin");
const uploadController = require("../controllers/UploadController");

// Market Zone Routes
router.post("/marketzone/create", MarketZoneController.createMarketZone);
router.get("/marketzone/getzones", MarketZoneController.getAllZones);

// Merchant Routes
router.post("/merchant/create", 
    ...uploadController.getUploader('merchants', 'fileInputsImage'),
    MerchantController.createMerchant
);

router.put("/merchant/:id",
    ...uploadController.getUploader('merchants', 'fileInputsImage'),
    MerchantController.editMerchant
);

router.delete("/merchant/deleteimage/:id", MerchantController.deleteMerchantImage);
router.delete("/merchant/:id", isAdmin, MerchantController.deleteMerchantById);

// Merchant Shop Routes
router.post("/merchantshop/create",
    ...uploadController.getUploader('shops', 'fileInputsImage'),
    MerchantShopController.createShop
);

// ... rest of the routes remain unchanged

module.exports = router;