const { format } = require("date-fns");
const db = require("../models");
const { Sequelize } = require("sequelize");
const Controller = {};

const {
	Profile,
	Product,
	ProductImages,
	MerchantShop,
	Merchant,
	MerchantShopCategory,
	ProductCategory,
	ProductSubcategory,
	Category,
	User,
	Transaction,
	GoogleAuthService,
	MarketZones,
} = db.sequelize.models;

const getHomePage = (req, res) => {
	//res.render("page/home", { session: false });
	console.log("req user", req);
	res.render("page/account", {
		title: "Home",
		layout: "layout/account",
	});
};

const renderAddMerchantShop = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });
	const merchants = await Merchant.findAll({ raw: true });

	console.log("user>>", req.user);
	console.log("marketZones>>", marketZones);
	res.render("page/account/createshop", {
		title: "Products",
		layout: "layout/account",
		data: {
			zones: marketZones,
			merchants: merchants,
		},
	});
};

const getMerchantshops = async (req, res) => {
	//fetch all products
	try {
		console.log("user@Merchant", req.user);
		const m_shops = await MerchantShop.findAll({
			raw: true,
			where: { merchantUuid: req.user.uuid },
		});

		for (let i = 0; i < m_shops.length; i++) {
			const mshop = m_shops[i];
			console.log("mshopa", mshop);
			const mshopCat = await MerchantShopCategory.findOne({
				raw: true,
				where: { uuid: mshop.merchantShopCategoryUuid },
			});
			console.log("mshopCat", mshopCat);
			mshop.merchantShopCategory = mshopCat;
			// get  Merchant
			const merchant = await Merchant.findOne({
				raw: true,
				where: { uuid: mshop.merchantUuid },
			});
			mshop.merchant = merchant;
			// get Zone
			const zone = await MarketZones.findOne({
				raw: true,
				where: { zoneUuid: mshop.zoneUuid },
			});
			mshop.zone = zone;
			mshop.createdAt = format(mshop.createdAt, "do MMMM, yyyy");
		}

		console.log("m_shops>>", m_shops);
		res.render("page/account/shops", {
			title: "Merchant Shop",
			layout: "layout/account",
			shops: m_shops,
		});
	} catch (error) {
		console.log("error>>", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

const getProducts = async (req, res) => {
	//fetch all products
	try {
		// Get all MerchantShops
		const allMerchantShops = await MerchantShop.findAll({
			where: { merchantUuid: req.user.uuid },
			raw: true,
		});

		const allShopIds = allMerchantShops.map((r) => r.uuid);

		const products = await Product.findAll({
			raw: true,
			where: {
				merchantShopUuid: {
					[Sequelize.Op.in]: allShopIds,
				},
			},
		});

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const productFiles = await ProductImages.findAll({
				where: { productUuid: product.uuid },
			});
			product.productFiles = productFiles;
			// get Zone
			// const zone = await MarketZones.findOne({
			// 	where: { zoneUuid: product.zoneUuid },
			// });
			// product.zone = zone;

			// get Product Category
			const productCategory = await ProductCategory.findOne({
				where: { uuid: product.categoryUuid },
				raw: true,
			});
			product.productCategory = productCategory;
			/// Get Product Sub Category
			const productSubCategory = await ProductSubcategory.findOne({
				where: { uuid: product.subCategoryUuid },
				raw: true,
			});
			product.productSubCategory = productSubCategory;

			// Get Merchant category

			// const merchantShopCategory = await MerchantShopCategory.findOne({
			// 	where: { uuid: product.merchantShopCategoryUuid },
			// });
			// product.merchantShopCategory = merchantShopCategory;

			// Get Merchant Shop

			const merchantShop = await MerchantShop.findOne({
				where: { uuid: product.merchantShopUuid },
				raw: true,
			});
			product.merchantShop = merchantShop;
			product.createdAt = format(product.createdAt, "do MMMM, yyyy");
		}

		console.log("allMerchantShops>>>", allMerchantShops);
		console.log("products>>", products);
		console.log("allShopIds>>", allShopIds);
		console.log("currentMerchant>>", req.user.uuid);
		res.render("page/account/products", {
			title: "Products",
			layout: "layout/account",
			products: products,
		});
	} catch (error) {
		console.log("error", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

const renderAddProduct = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });
	const merchantShops = await MerchantShop.findAll({
		where: { merchantUuid: req.user.uuid },
		raw: true,
	});
	console.log("marketZones>>", marketZones);
	// const productCategory = await ProductCategory.findAll({ raw: true });

	res.render("page/account/createproduct", {
		title: "Products",
		layout: "layout/account",
		data: {
			zones: marketZones,
			merchantShops,
		},
	});
};

const getProductsById = async (req, res) => {
	try {
		const product = await Product.findByPk(req.params.uuid, {
			raw: true,
		});
		const merchantShops = await MerchantShop.findAll({ raw: true });
		if (!product) {
			return res.redirect("/ads");
		}

		const productFiles = await ProductImages.findAll({
			where: { productUuid: product.uuid },
		});
		product.productFiles = productFiles;
		// get Zone
		// const zone = await MarketZones.findOne({
		// 	where: { zoneUuid: product.zoneUuid },
		// });
		// product.zone = zone;

		// get Product Category
		const productCategory = await ProductCategory.findOne({
			where: { uuid: product.categoryUuid },
		});
		product.productCategory = productCategory;
		/// Get Product Sub Category
		const productSubCategory = await ProductSubcategory.findOne({
			where: { uuid: product.subCategoryUuid },
		});
		product.productSubCategory = productSubCategory;

		// Get Merchant category

		// const merchantShopCategory = await MerchantShopCategory.findOne({
		// 	where: { uuid: product.merchantShopCategoryUuid },
		// });
		// product.merchantShopCategory = merchantShopCategory;

		const merchantShop = await MerchantShop.findOne({
			where: { uuid: product.merchantShopUuid },
		});
		product.merchantShop = merchantShop;

		const marketZones = await MarketZones.findAll({ raw: true });

		res.render("page/account/edit-product", {
			title: "Edit product",
			layout: "layout/account",
			product: product,
			data: {
				zones: marketZones,
				merchantShops,
			},
		});
	} catch (error) {
		console.log("error", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};
const getMerchantShoptById = async (req, res) => {
	try {
		const mshop = await MerchantShop.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		// If the request user is not the creator of the shop
		if (!mshop.merchantUuid == req.user.uuid) {
			res.render("errors/404", {
				title: "Ads",
				layout: "layout/index",
			});
		}

		const mshopCat = await MerchantShopCategory.findOne({
			raw: true,
			where: { uuid: mshop.merchantShopCategoryUuid },
		});

		mshop.merchantShopCategory = mshopCat;

		// get  Merchant
		const merchant = await Merchant.findOne({
			raw: true,
			where: { uuid: mshop.merchantUuid },
		});
		mshop.merchant = merchant;

		// get Zone

		const zone = await MarketZones.findAll({
			raw: true,
			where: { zoneUuid: mshop.zoneUuid },
		});

		mshop.zone = zone;

		mshop.createdAt = format(mshop.createdAt, "do MMMM, yyyy");

		const marketZones = await MarketZones.findAll({ raw: true });

		const merchants = await Merchant.findAll({ raw: true });

		res.render("page/account/edit-shop", {
			title: "Products",
			layout: "layout/account",
			shop: mshop,
			data: {
				zones: marketZones,
				merchants: merchants,
			},
		});
	} catch (error) {
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};


module.exports = {
	getHomePage,
	renderAddMerchantShop,
	getMerchantshops,
	getMerchantShoptById,
	getProducts,
	renderAddProduct,
	getProductsById,
};
