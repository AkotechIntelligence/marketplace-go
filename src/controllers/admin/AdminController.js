const { Sequelize, QueryTypes } = require("sequelize");
const db = require("../../models");
const { Op } = require("sequelize");
const { format } = require("date-fns");
const Controller = {};
module.exports = Controller;
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



function convertDateAgo(date) {
	console.log("date>>>>>>>>>>>>>>>>>>>>>>>", date);
	const currentDate = new Date();
	const adDate = new Date(date);
	const diffTime = Math.abs(currentDate - adDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	console.log("diffDays>>>>>>>>>>>>>>>>>>>>>>>", diffDays);
	if (diffDays === 1) {
		return `${diffDays} day ago`;
	}
	console.log("diffDays>>>>>>>>>>>>>>>>>>>>>>>1", diffDays);
	return `${diffDays} days ago`;
}

Controller.manageCategories = async (req, res) => {
	res.render("page/admin/category/manageCategories", {
		title: "Manage Categories",
		layout: "layout/admin-layout",
	});
};

Controller.index = async (req, res) => {
	const users = await User.count();
	const products = await Product.count();
	const merchantShops = await MerchantShop.count();
	const merchantShopCategory = await MerchantShopCategory.count();
	const productCategory = await ProductCategory.count();
	const productSubcategory = await ProductSubcategory.count();

	const data = {
		users: users,
		products: products,
		merchantShops: merchantShops,
		merchantShopCategory: merchantShopCategory,
		productCategory,
		productSubcategory,
	};

	res.render("admin/home", {
		title: "Dashboard",
		layout: "layout/admin-layout",
		data: data,
	});
};

Controller.products = async (req, res) => {
	try {
		const products = await Product.findAll({
			raw: true,
		});

		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const productFiles = await ProductImages.findAll({
				where: { productUuid: product.uuid },
			});
			product.productFiles = productFiles;

			const productCategory = await ProductCategory.findOne({
				where: { uuid: product.categoryUuid },
				raw: true,
			});
			product.productCategory = productCategory;

			const productSubCategory = await ProductSubcategory.findOne({
				where: { uuid: product.subCategoryUuid },
				raw: true,
			});
			product.productSubCategory = productSubCategory;

			const merchantShop = await MerchantShop.findOne({
				where: { uuid: product.merchantShopUuid },
				raw: true,
			});
			product.merchantShop = merchantShop;
			product.createdAt = format(product.createdAt, "do MMMM, yyyy");
		}

		console.log("products>>>", products);
		res.render("page/admin/ads", {
			title: "Products",
			layout: "layout/admin-layout",
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

Controller.getProductsById = async (req, res) => {
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

		const productCategory = await ProductCategory.findOne({
			where: { uuid: product.categoryUuid },
		});
		product.productCategory = productCategory;

		const productSubCategory = await ProductSubcategory.findOne({
			where: { uuid: product.subCategoryUuid },
		});
		product.productSubCategory = productSubCategory;

		const merchantShop = await MerchantShop.findOne({
			where: { uuid: product.merchantShopUuid },
		});
		product.merchantShop = merchantShop;

		const marketZones = await MarketZones.findAll({ raw: true });

		res.render("page/admin/edit-product", {
			title: "Edit product",
			layout: "layout/admin-layout",
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

Controller.renderAddProduct = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });
	const merchantShops = await MerchantShop.findAll({ raw: true });
	console.log("marketZones>>", marketZones);

	res.render("page/admin/add-product", {
		title: "Products",
		layout: "layout/admin-layout",
		data: {
			zones: marketZones,
			merchantShops,
		},
	});
};

Controller.getMerchantshops = async (req, res) => {
	try {
		const m_shops = await MerchantShop.findAll({
			raw: true,
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

			const merchant = await Merchant.findOne({
				raw: true,
				where: { uuid: mshop.merchantUuid },
			});
			mshop.merchant = merchant;

			const zone = await MarketZones.findOne({
				raw: true,
				where: { zoneUuid: mshop.zoneUuid },
			});

			mshop.zone = zone;

			mshop.createdAt = format(mshop.createdAt, "do MMMM, yyyy");
		}

		console.log("m_shops>>", m_shops);
		res.render("page/admin/merchant-shops", {
			title: "Merchant Shop",
			layout: "layout/admin-layout",
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

Controller.getMerchantshopsCategory = async (req, res) => {
	try {
		const m_shopscategories = await MerchantShopCategory.findAll({
			raw: true,
		});

		for (let i = 0; i < m_shopscategories.length; i++) {
			const mshopcategory = m_shopscategories[i];

			const zone = await MarketZones.findOne({
				raw: true,
				where: { zoneUuid: mshopcategory.zoneUuid },
			});

			mshopcategory.zone = zone;

			mshopcategory.createdAt = format(
				mshopcategory.createdAt,
				"do MMMM, yyyy"
			);
		}

		res.render("page/admin/merchant-shops-category", {
			title: "Merchant Shop Category",
			layout: "layout/admin-layout",
			merchantShopCategory: m_shopscategories,
		});
	} catch (error) {
		console.log("error>>", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.getProductCategories = async (req, res) => {
	try {
		const productCats = await ProductCategory.findAll({
			raw: true,
		});

		for (let i = 0; i < productCats.length; i++) {
			const mProductCat = productCats[i];

			const mshopCat = await MerchantShopCategory.findOne({
				raw: true,
				where: { uuid: mProductCat.merchantShopCategoryUuid },
			});

			mProductCat.merchantShopCategory = mshopCat;

			const zone = await MarketZones.findOne({
				raw: true,
				where: { zoneUuid: mProductCat.zoneUuid },
			});

			mProductCat.zone = zone;

			mProductCat.createdAt = format(mProductCat.createdAt, "do MMMM, yyyy");
		}

		console.log("productCats", productCats);
		res.render("page/admin/product-categories", {
			title: "Product Categories",
			layout: "layout/admin-layout",
			productCats: productCats,
		});
	} catch (error) {
		console.log("error>>", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.renderAddMerchantShop = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });
	const merchants = await Merchant.findAll({ raw: true });
	console.log("marketZones>>", marketZones);
	res.render("page/admin/add-merchant-shop", {
		title: "Products",
		layout: "layout/admin-layout",
		data: {
			zones: marketZones,
			merchants: merchants,
		},
	});
};

Controller.renderAddMerchantShopCategory = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });

	res.render("page/admin/add-merchant-shop-category", {
		title: "Merchant Shop Category",
		layout: "layout/admin-layout",
		data: {
			zones: marketZones,
		},
	});
};

Controller.renderAddProductCategory = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });

	console.log("marketZones>>", marketZones);
	res.render("page/admin/add-product-category", {
		title: "Products",
		layout: "layout/admin-layout",
		data: {
			zones: marketZones,
		},
	});
};

Controller.renderAddProductSubCategory = async (req, res) => {
	const productCategories = await ProductCategory.findAll({ raw: true });

	res.render("page/admin/add-product-subcategory", {
		title: "Product Sub Categories",
		layout: "layout/admin-layout",
		data: {
			productCategories: productCategories,
		},
	});
};

Controller.getMerchantShopCategoryById = async (req, res) => {
	try {
		const mshopCategory = await MerchantShopCategory.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		const zone = await MarketZones.findAll({
			raw: true,
			where: { zoneUuid: mshopCategory.zoneUuid },
		});

		mshopCategory.zone = zone;

		mshopCategory.createdAt = format(mshopCategory.createdAt, "do MMMM, yyyy");

		const marketZones = await MarketZones.findAll({ raw: true });

		res.render("page/admin/edit-merchant-shop-category", {
			title: "Merchant Shop Category",
			layout: "layout/admin-layout",
			merchantShopCategory: mshopCategory,
			data: {
				zones: marketZones,
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

Controller.getMerchantShoptById = async (req, res) => {
	try {
		const mshop = await MerchantShop.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		const mshopCat = await MerchantShopCategory.findOne({
			raw: true,
			where: { uuid: mshop.merchantShopCategoryUuid },
		});

		mshop.merchantShopCategory = mshopCat;

		const merchant = await Merchant.findOne({
			raw: true,
			where: { uuid: mshop.merchantUuid },
		});
		mshop.merchant = merchant;

		const zone = await MarketZones.findAll({
			raw: true,
			where: { zoneUuid: mshop.zoneUuid },
		});

		mshop.zone = zone;

		mshop.createdAt = format(mshop.createdAt, "do MMMM, yyyy");

		const marketZones = await MarketZones.findAll({ raw: true });

		const merchants = await Merchant.findAll({ raw: true });

		res.render("page/admin/edit-merchant-shop", {
			title: "Products",
			layout: "layout/admin-layout",
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

Controller.getProductCategoryById = async (req, res) => {
	try {
		const productCat = await ProductCategory.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		const mshopCat = await MerchantShopCategory.findOne({
			raw: true,
			where: { uuid: productCat.merchantShopCategoryUuid },
		});

		productCat.merchantShopCategory = mshopCat;

		const zone = await MarketZones.findAll({
			raw: true,
			where: { zoneUuid: productCat.zoneUuid },
		});

		productCat.zone = zone;

		productCat.createdAt = format(productCat.createdAt, "do MMMM, yyyy");

		const marketZones = await MarketZones.findAll({ raw: true });

		res.render("page/admin/edit-product-category", {
			title: "Products",
			layout: "layout/admin-layout",
			productCategory: productCat,
			data: {
				zones: marketZones,
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

Controller.getProductSubCategories = async (req, res) => {
	try {
		const productSubCats = await ProductSubcategory.findAll({
			raw: true,
		});

		for (let i = 0; i < productSubCats.length; i++) {
			const mProductCat = productSubCats[i];

			const productCat = await ProductCategory.findOne({
				raw: true,
				where: { uuid: mProductCat.productCategoryUuid },
			});
			mProductCat.productCategory = productCat;

			mProductCat.createdAt = format(mProductCat.createdAt, "do MMMM, yyyy");
		}

		console.log("productSubCats", productSubCats);
		res.render("page/admin/productsub-categories", {
			title: "Product Sub Categories",
			layout: "layout/admin-layout",
			productSubCategory: productSubCats,
		});
	} catch (error) {
		console.log("error>>", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.getProductSubCategoryById = async (req, res) => {
	try {
		const productSubCat = await ProductSubcategory.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		const pCat = await ProductCategory.findOne({
			raw: true,
			where: { uuid: productSubCat.productCategoryUuid },
		});

		productSubCat.productCategory = pCat;

		productSubCat.createdAt = format(productSubCat.createdAt, "do MMMM, yyyy");

		const allProductCategory = await ProductCategory.findAll();
		res.render("page/admin/edit-product-subcategory", {
			title: "Product Sub Categories",
			layout: "layout/admin-layout",
			productSubCategory: productSubCat,
			productCategory: allProductCategory,
		});
	} catch (error) {
		console.log("error", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.getMerchants = async (req, res) => {
	try {
		let merchants = await Merchant.findAll({
			raw: true,
		});

		merchants = merchants.map((data) => {
			return {
				...data,
				createdAt: format(data.createdAt, "do MMMM, yyyy"),
			};
		});

		res.render("page/admin/merchants", {
			title: "Merchant Shop",
			layout: "layout/admin-layout",
			merchants: merchants,
		});
	} catch (error) {
		console.log("error>>", error);
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.renderAddMerchant = async (req, res) => {
	const marketZones = await MarketZones.findAll({ raw: true });

	console.log("marketZones>>", marketZones);
	res.render("page/admin/add-merchant", {
		title: "Merchants",
		layout: "layout/admin-layout",
	});
};

Controller.renderAddUser = async (req, res) => {
	res.render("page/admin/add-user", {
		title: "User",
		layout: "layout/admin-layout",
	});
};

Controller.getMerchantById = async (req, res) => {
	try {
		const merchant = await Merchant.findOne({
			where: { uuid: req.params.uuid },
			raw: true,
		});

		delete merchant.password;
		delete merchant.password_key;

		if (!merchant) {
			res.render("errors/404", {
				title: "Ads",
				layout: "layout/index",
			});
		}

		merchant.dateOfBirth = `${merchant.dateOfBirth}`.split("T")[0];

		console.log("merchant>>", merchant);
		res.render("page/admin/edit-merchant", {
			title: "Merchant",
			layout: "layout/admin-layout",
			merchant,
		});
	} catch (error) {
		res.render("errors/404", {
			title: "Ads",
			layout: "layout/index",
		});
	}
};

Controller.categories = async (req, res) => {
	const categories = await Category.findAll({
		raw: true,
	});

	res.render("page/admin/categories", {
		title: "Categories",
		layout: "layout/admin-layout",
		categories: categories,
	});
};

Controller.addcategories = async (req, res) => {
	res.render("page/admin/addcategories", {
		title: "Categories",
		layout: "layout/admin-layout",
	});
};

Controller.getCategoryById = async (req, res) => {
	const category = await Category.findByPk(req.params.uuid, {
		raw: true,
	});
	if (!category) {
		return res.redirect("/adCategories");
	}

	res.render("page/admin/category", {
		category: category,
		title: "Edit Categories",
		layout: "layout/admin-layout",
	});
};

Controller.users = async (req, res) => {
	const users = await User.findAll({
		raw: true,
	});
	// also fetch users in GoogleAuthService and merge them
	// with the users from the database
	const googleUsers = await GoogleAuthService.findAll({
		raw: true,
	});
	if (googleUsers.length > 0) {
		googleUsers.forEach((user) => {
			user.createdAt = user.created_at;
		});
		users.push(...googleUsers);
	}
	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		const profile = await Profile.findOne({
			where: { userUuid: user.uuid },
		});
		user.profile = profile;
		user.profile.createdAtAgo = convertDateAgo(user.profile.createdAt);
	}

	res.render("page/admin/users", {
		title: "Users",
		layout: "layout/admin-layout",
		users: users,
	});
};

Controller.transactions = async (req, res) => {
	const transactions = await Transaction.findAll({
		raw: true,
		order: [["createdAt", "DESC"]],
	});

	for (let i = 0; i < transactions.length; i++) {
		const transaction = transactions[i];
		let buyer = await User.findOne({
			where: { uuid: transaction.buyerUuid },
		});
		if (!buyer) {
			const googleUser = await GoogleAuthService.findOne({
				where: { uuid: transaction.buyerUuid },
			});
			buyer = googleUser;
		}
		console.log("buyer>>>>>>>>>>>>>>>>>>>>>>>", buyer);
		let seller = await Profile.findOne({
			where: { uuid: transaction.sellerUuid },
			raw: true,
		});
		if (!seller) {
			const googleUser = await GoogleAuthService.findOne({
				where: { uuid: transaction.sellerUuid },
				raw: true,
			});
			seller = googleUser;
		}
		const profile = await User.findOne({
			where: { uuid: seller.userUuid },
		});

		console.log("profile>>>>>>>>>>>>>>>>>>>>>>>", profile);
		seller.profile = profile;
		const product = await ProductService.findOne({
			where: { uuid: transaction.productUuid },
		});
		transaction.seller = seller;
		transaction.buyer = buyer;
		transaction.product = product;
		transaction.createdAtAgo = convertDateAgo(transaction.createdAt);
	}

	res.render("page/admin/transactions", {
		title: "Transactions",
		layout: "layout/admin-layout",
		transactions: transactions,
	});
};

Controller.deleteProduct = async (req, res) => {
	const { uuid } = req.params;
	const product = await ProductService.findOne({
		where: { uuid: uuid },
	});
	if (product) {
		await product.destroy();
	}
	req.flash("success", "Product deleted successfully");
	res.redirect("/admin/ads");
};

Controller.deleteCategory = async (req, res) => {
	const { id } = req.params;
	const category = await Category.findOne({
		where: { uuid: id },
	});
	if (category) {
		await category.destroy();
	}
	res.redirect("/admin/categories");
};

Controller.deleteUser = async (req, res) => {
	const { uuid } = req.params;
	const user = await User.findOne({
		where: { uuid: uuid },
	});
	if (user) {
		await user.destroy();
	} else {
		const googleUser = await GoogleAuthService.findOne({
			where: { uuid: uuid },
		});
		if (googleUser) {
			await googleUser.destroy();
		}
	}
	res.redirect("/admin/users");
};
