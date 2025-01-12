const express = require("express");
const router = express.Router();
const isAuthenticatedMerchant = require("../middleware/isAuthenticatedMerchant");
const MerchantController = require("../controllers/merchants/MerchantController");
const MerchantShopController = require("../controllers/merchants/MerchantShopController");
const ProductController = require("../controllers/merchants/ProductController");
const OrderController = require("../controllers/merchants/OrderController");
const uploadController = require("../controllers/UploadController");

// Apply merchant authentication middleware to all routes
router.use(isAuthenticatedMerchant);

// Dashboard
router.get("/", MerchantController.getDashboard);

// Shop Routes
router.get("/shops", MerchantShopController.getShops);
router.get("/shops/create", MerchantShopController.renderCreateShop);
router.post("/shops/create",
    ...uploadController.getUploader('shops', 'fileInputsImage'),
    MerchantShopController.createShop
);
router.get("/shops/:shopUuid/edit", MerchantShopController.renderEditShop);
router.post("/shops/:shopUuid/edit",
    ...uploadController.getUploader('shops', 'fileInputsImage'),
    MerchantShopController.updateShop
);
router.delete("/shops/:shopUuid", MerchantShopController.deleteShop);

// Product Routes
router.get("/products", ProductController.getProducts);
router.get("/products/:shopUuid", ProductController.getProducts);
router.get("/product/create", ProductController.renderCreateProduct);
router.get("/product/create/:shopUuid", ProductController.renderCreateProduct);
router.post("/product/create",
    ...uploadController.getMultiUploader('products', 'files', 5),
    ProductController.createProduct
);
router.get("/product/edit/:productUuid", ProductController.renderEditProduct);
router.post("/product/edit/:productUuid",
    ...uploadController.getMultiUploader('products', 'files', 5),
    ProductController.updateProduct
);
router.delete("/product/:productUuid", ProductController.deleteProduct);

// Order Routes
router.get("/orders", OrderController.getMerchantOrders);
router.get("/orders/:shopUuid", OrderController.getMerchantOrders);
router.get("/order/:orderId", OrderController.getOrderDetails);
router.put("/order/:orderId/status", OrderController.updateOrderStatus);

// API Routes
router.delete("/api/shops/:shopUuid/image", MerchantShopController.deleteShopImage);
router.delete("/api/products/images/:imageId", ProductController.deleteProductImage);

module.exports = router;