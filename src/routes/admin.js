const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/admin/AdminController");
const isAdmin = require("../middleware/admin");
router.get("/dashboard", isAdmin, AdminController.index);
router.get("/product", isAdmin, AdminController.products);
router.get("/product/edit/:uuid", isAdmin, AdminController.getProductsById);

router.get("/product/add", isAdmin, AdminController.renderAddProduct);

// Merchant Shop
router.get("/merchantshops", isAdmin, AdminController.getMerchantshops);
router.get(
	"/merchantshop/edit/:uuid",
	isAdmin,
	AdminController.getMerchantShoptById
);
router.get("/merchantshop/add", isAdmin, AdminController.renderAddMerchantShop);

// Merchant Shop Category

router.get(
	"/merchantshop-category",
	isAdmin,
	AdminController.getMerchantshopsCategory
);
router.get(
	"/merchantshop-category/edit/:uuid",
	isAdmin,
	AdminController.getMerchantShopCategoryById
);
router.get(
	"/merchantshop-category/add",
	isAdmin,
	AdminController.renderAddMerchantShopCategory
);

//  Merchant
router.get("/merchant/add", isAdmin, AdminController.renderAddMerchant);
router.get("/merchant/edit/:uuid", isAdmin, AdminController.getMerchantById);
router.get("/merchants", isAdmin, AdminController.getMerchants);

// Users
router.get("/user/add", isAdmin, AdminController.renderAddUser);
router.get("/user/edit/:uuid", isAdmin, AdminController.getMerchantById);
router.get("/users", isAdmin, AdminController.getMerchants);

// Prodcut Category

router.get("/merchantshops", isAdmin, AdminController.getMerchantshops);

router.get(
	"/product-category/add",
	isAdmin,
	AdminController.renderAddProductCategory
);

router.get("/product-category", isAdmin, AdminController.getProductCategories);

router.get(
	"/product-category/edit/:uuid",
	isAdmin,
	AdminController.getProductCategoryById
);

// Product Sub Category
router.get(
	"/productsub-category",
	isAdmin,
	AdminController.getProductSubCategories
);

router.get(
	"/productsub-category/edit/:uuid",
	isAdmin,
	AdminController.getProductSubCategoryById
);

router.get(
	"/productsub-category/add",
	isAdmin,
	AdminController.renderAddProductSubCategory
);

router.get("/categories", isAdmin, AdminController.categories);
router.get("/add-categories", isAdmin, AdminController.addcategories);
router.get("/category/:uuid", isAdmin, AdminController.getCategoryById);
router.get("/users", isAdmin, AdminController.users);
router.get("/transactions", AdminController.transactions);

router.get("/delete-product/:uuid", isAdmin, AdminController.deleteProduct);
router.get("/delete-category/:uuid", isAdmin, AdminController.deleteCategory);
router.get("/delete-user/:uuid", isAdmin, AdminController.deleteUser);

router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

// GET /admin

router.get("/manage-categories", isAdmin, AdminController.manageCategories);




module.exports = router;
