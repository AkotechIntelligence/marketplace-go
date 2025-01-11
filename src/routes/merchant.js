const express = require("express");
const router = express.Router();
const isAuthenticatedMerchant = require("../middleware/isAuthenticatedMerchant");
const MerchantController = require("../controllers/merchants/MerchantController");
const MerchantShopController = require("../controllers/merchants/MerchantShopController");
const MerchantProductController = require("../controllers/merchants/ProductController");
const MerchantOrderController = require("../controllers/merchants/OrderController");
const uploadController = require("../controllers/UploadController");

// Dashboard
router.get("/", isAuthenticatedMerchant, MerchantController.getDashboard);

// Profile Routes
router.get("/profile", isAuthenticatedMerchant, MerchantController.getMerchantProfile);
router.post("/profile", 
    isAuthenticatedMerchant,
    ...uploadController.getUploader('merchants', 'fileInputsImage'),
    MerchantController.createMerchant
);
router.put("/profile/:id",
    isAuthenticatedMerchant,
    ...uploadController.getUploader('merchants', 'fileInputsImage'),
    MerchantController.editMerchant
);
router.delete("/profile/image/:id",
    isAuthenticatedMerchant,
    MerchantController.deleteMerchantImage
);

// Shop Routes
router.get("/shops", isAuthenticatedMerchant, MerchantShopController.getShops);
router.get("/shops/create", isAuthenticatedMerchant, MerchantShopController.renderCreateShop);
router.post("/shops/create",
    isAuthenticatedMerchant,
    ...uploadController.getUploader('shops', 'fileInputsImage'),
    MerchantShopController.createShop
);

// Product Routes
router.get("/products", isAuthenticatedMerchant, MerchantProductController.getProducts);
router.get("/products/create", isAuthenticatedMerchant, MerchantProductController.renderCreateProduct);
router.post("/products/create",
    isAuthenticatedMerchant,
    ...uploadController.getMultiUploader('products', 'files', 5),
    MerchantProductController.createProduct
);

// Order Routes
router.get("/orders", isAuthenticatedMerchant, MerchantOrderController.getMerchantOrders);

module.exports = router;