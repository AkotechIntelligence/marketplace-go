const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const MarketZoneController = require("../controllers/MarketZoneController");
const MerchantController = require("../controllers/MerchantController");
const MerchantShopController = require("../controllers/MerchantShopController");
const MerchantShopCategoryController = require("../controllers/MerchantShopCategoryController");
const ProductController = require("../controllers/ProductController");
const ProductCategoryController = require("../controllers/ProductCategoryController");
const ProductSubCategoryController = require("../controllers/ProductSubCategoryController");
const isAdmin = require("../middleware/admin");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/uploads/");
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		); // File name
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 2 * 1024 * 1024 },
}).array("files");

const uploadSingle = multer({
	storage: storage,
	limits: { fileSize: 2 * 1024 * 1024 },
});

const storageDir1 = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log("file", file);
		if (file.fieldname == "file1") {
			cb(null, "public/uploads");
		}
	},
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		); // File name
	},
});

const uploadDirMerchantShop = multer({ storage: storageDir1 });

const uploadFileMerchantShop = (req, res, next) => {
	uploadDirMerchantShop.single("file1")(req, res, (err) => {
		if (err) {
			console.error("Error uploading file 1:", err);
			return res.status(500).send("Error uploading file 1");
		}

		console.log("got here");
		next();
	});
};

router.post("/marketzone/create", MarketZoneController.createMarketZone);
router.get("/marketzone/getzones", MarketZoneController.getAllZones);

router.post(
	"/merchantshop/create",
	uploadSingle.single("fileInputsImage"),
	MerchantShopController.createMerchantShop
);

router.delete(
	"/merchantshop/deleteimage/:id",
	MerchantShopController.deleteMerchantShopImage
);

router.put(
	"/merchantshop/:id",
	uploadSingle.single("fileInputsImage"),
	MerchantShopController.editMerchantShop
);

router.delete(
	"/merchantshop/:id",
	isAdmin,
	MerchantShopController.deleteMerchantShopById
);

router.delete(
	"/merchantshop/merchant/:id",
	MerchantShopController.deleteMerchantShopById
);

router.post(
	"/merchantshopcategory/create",
	uploadFileMerchantShop,
	MerchantShopCategoryController.createMerchantShopCategory
);

// Merchant Shop Category
router.get(
	"/merchantshopcategory/zone/:zoneuuid",
	MerchantShopCategoryController.getMerchantShopByZoneId
);

router.get(
	"/merchantshopcategory/zone/:zoneuuid",
	MerchantShopCategoryController.getMerchantShopByZoneId
);

router.post(
	"/merchantshopcategory/create",
	uploadSingle.single("fileInputsImage"),
	MerchantShopCategoryController.createMerchantShopCategory
);

router.put(
	"/merchantshopcategory/:id",
	uploadSingle.single("fileInputsImage"),
	MerchantShopCategoryController.editMerchantShopCategory
);

router.delete(
	"/merchantshopcategory/:id",
	isAdmin,
	MerchantShopCategoryController.deleteMerchantShopCategoryById
);

//  Merchant
router.post(
	"/merchant/create",
	uploadSingle.single("fileInputsImage"),
	MerchantController.createMerchant
);

router.put(
	"/merchant/:id",
	uploadSingle.single("fileInputsImage"),
	MerchantController.editMerchant
);

router.delete(
	"/merchant/deleteimage/:id",
	MerchantController.deleteMerchantImage
);
router.delete("/merchant/:id", isAdmin, MerchantController.deleteMerchantById);

// Product Categoyr

router.put(
	"/product-category/:id",
	uploadSingle.single("fileInputsImage"),
	ProductCategoryController.editProductCategory
);

router.post(
	"/product-category",
	uploadSingle.single("fileInputsImage"),
	ProductCategoryController.createProductCategory
);

router.delete(
	"/product-category/:id",
	ProductCategoryController.deleteProdutcById
);

// Product Sub Category

router.put(
	"/product-subcategory/:id",
	uploadSingle.single("fileInputsImage"),
	ProductSubCategoryController.editProductSubCategory
);

router.post(
	"/product-subcategory",
	uploadSingle.single("fileInputsImage"),
	ProductSubCategoryController.createProductSubCategory
);

router.delete(
	"/product-subcategory/:id",
	ProductSubCategoryController.deleteProdutCategoryById
);

//

router.post(
	"/product/create",
	(req, res, next) => {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res
						.status(400)
						.json({ message: "File size exceeds 2MB limit." });
				}
			} else if (err) {
				// An unknown error occurred

				return res.status(500).send(err);
			}
			next();
		});
	},

	ProductController.createProduct
);
router.post(
	"/productcategory/create",
	ProductCategoryController.createProductCategory
);

router.get(
	"/productcategory/zone/:zoneuuid",
	ProductCategoryController.productCategoryByZoneId
);

router.use(
	"/productsubcategory/create",
	ProductSubCategoryController.createProductSubCategory
);

router.get(
	"/productsubcategory/product/:productId",
	ProductSubCategoryController.getProductSubCategoryByProductId
);

// router.post("/otp/send/", otpController.sendOTP);
// router.post("/profile/create/:userUuid", profileController.saveOrUpdate);
// // router.put("/profile/edit/:userUuid", profileController.editProfile);
// router.get("/profile/geolocation", profileController.getGeoLocation);
// router.post("/profile/geolocation", profileController.saveGeolocation);

// router.post("/category/create/", categoryController.createCategory);
// router.put("/category/edit/:categoryUuid/", categoryController.editCategory);

router.post(
	"/product/",
	(req, res, next) => {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res
						.status(400)
						.json({ message: "File size exceeds 2MB limit." });
				}
			} else if (err) {
				// An unknown error occurred

				return res.status(500).send(err);
			}
			next();
		});
	},

	ProductController.createProduct
);

router.put(
	"/product/edit/:id",
	(req, res, next) => {
		upload(req, res, function (err) {
			if (err instanceof multer.MulterError) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res
						.status(400)
						.json({ message: "File size exceeds 2MB limit." });
				}
			} else if (err) {
				// An unknown error occurred
				console.log("err file", err);
				return res.status(500).send(err);
			}
			next();
		});
	},

	ProductController.editProduct
);

router.delete("/productimage/:id", ProductController.deleteProductImagebyId);
router.delete("/product/:id", isAdmin, ProductController.deleteProdutcById);
// router.post("/create", ProductCategoryController.createProductCategory);
// router.post("/create", ProductSubSubCategoryController.createSubSubCategory);



// router.post(
// 	"/add-categories/",
// 	uploadFileCategory,

// 	categoryController.createCategory
// );

// router.put(
// 	"/edit-categories/:id",
// 	uploadFileCategory,
// 	categoryController.editCategory
// );

// router.delete("/delete-category/:id", categoryController.deleteCategory);

module.exports = router;
