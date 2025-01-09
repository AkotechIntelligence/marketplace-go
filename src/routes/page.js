const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const HomePageController = require("../controllers/HomePageController");
const AccountPageController = require("../controllers/AccountPageController");
const AuthController = require("../controllers/AuthController");
const {
	isAuthenticated,
	isNotAuthenticated,
	authenticateLogin,
	authenticateRegister,
} = require("../config/auth");
const MarketZoneController = require("../controllers/MarketZoneController");
const MerchantShopCategoryController = require("../controllers/MerchantShopCategoryController");
const ProductController = require("../controllers/ProductController");

// Rotas Get
router.get("/", UserController.getIndex);
router.get("/about", UserController.getAbout);
router.get("/contact", UserController.getContact);

// router.get("/login", isNotAuthenticated, UserController.getLogin);
// router.get("/register", isNotAuthenticated, UserController.getRegister);
// router.get("/logout", UserController.getLogout);
// router.post("/register", authenticateRegister);
// router.post("/login", authenticateLogin);



router.get("/contactus", isAuthenticated, UserController.getAuth);
// Rota autenticada
router.get("/auth", isAuthenticated, UserController.getAuth);
router.get("/marketzone/zones/:id", MarketZoneController.renderZoneById);
router.get(	"/marketzone/zones/merchantcategory/:id",MarketZoneController.getPageByMerchantId);
router.get(	"/merchantshopcategory/:zoneuuid",	MerchantShopCategoryController.getMerchantShopByZoneId);

router.get("/error", () => {
	throw new Error("Erro Interno");
});

router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

router.get("/product/:productuuid", ProductController.getProduct);

// Account
router.get("/account", AccountPageController.getHomePage);
router.get("/account/createshop", AccountPageController.renderAddMerchantShop);

router.get("/account/shops", AccountPageController.getMerchantshops);

router.get(
	"/account/shop/edit/:uuid",
	AccountPageController.getMerchantShoptById
);

router.get("/account/products", AccountPageController.getProducts);
router.get("/account/createproduct", AccountPageController.renderAddProduct);
router.get(
	"/account/product/edit/:uuid",
	AccountPageController.getProductsById
);


// router.post("/create", ProductCategoryController.createProductCategory);
// router.post("/create", ProductSubSubCategoryController.createSubSubCategory);
// router.post("/create", ProductController.createProduct);
// router.post("/addimages", ProductController.addProductImage);
// router.post("/create", ProductController.createProduct);
// router.post("/addimages", ProductController.addProductImage);
// router.post("/create", MerchantShopController.createMerchantShop);
// router.post("/create", MarketZoneController.createMarketZone);
// router.get("/getzones", MarketZoneController.getAllZones);
// router.get("/zones/:id", MarketZoneController.renderZoneById);
// router.get(	"/zones/merchantcategory/:id", MarketZoneController.getPageByMerchantId);

// router.post("/register", authenticateRegister);
// router.post("/login", authenticateLogin);
// router.get("/login", isNotAuthenticated, UserController.getLogin);
// router.get("/register", isNotAuthenticated, UserController.getRegister);
// router.get("/logout", UserController.getLogout);

// export default router;
module.exports = router;
