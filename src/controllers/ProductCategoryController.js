const db = require("../models");
const { ProductCategory, ProductSubcategory } = db;
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");


const ProductCategoryController = {
	async createProductCategory(req, res) {
		try {
			const { name, zoneUuid, merchantShopCategoryUuid } = req.body;

			console.log("body@prouduct categ", req.body);
			const findProductCategory = await ProductCategory.findOne({
				where: { name, zoneUuid, merchantShopCategoryUuid },
			});

			if (findProductCategory) {
				return res.status(403).json({
					message: "Product category already exist",
				});
			}
			const productCategory = await ProductCategory.create({
				uuid: uuidv4(),
				name,
				zoneUuid,
				merchantShopCategoryUuid,
			});

			res.json({
				message: "Product Category added successfully",
				status: "success",
			});
		} catch (error) {
			console.log("error", error);
			return res.status(400).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
		// res.render("page/home", { session: false });
	},

	async editProductCategory(req, res) {
		try {
			const findShop = await ProductCategory.findOne({
				where: { uuid: req.params.id },
			});
			if (!findShop) {
				return res.status(404).json({
					message: "Product category does not exist",
				});
			}
			console.log("req.body", req.body);

			const query = `
					UPDATE public."ProductCategory"
					SET
						name = :name,
						zone_uuid=:zoneUuid,
						merchant_shop_category_uuid=:merchantShopCategoryUuid
						WHERE
						uuid = :uuid
					`;
			const [rowsUpdated, _] = await db.sequelize.query(query, {
				replacements: {
					uuid: req.params.id,
					name: req.body.name,
					zoneUuid: req.body.zoneUuid,
					merchantShopCategoryUuid: req.body.merchantShopCategoryUuid,
				},
			});

			return res.status(201).json({
				message: "Product  Shop successfully updated",
				status: "success",
			});
		} catch (error) {
			console.log("error", error);
			return res.status(400).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},

	async productCategoryByZoneId(req, res) {
		console.log("req parmas", req.params);

		const findShop = await ProductCategory.findAll({
			where: { zoneUuid: req.params.zoneuuid },
			raw: true,
		});

		res.json({
			message: "done",
			data: findShop,
		});

		// res.render("page/home", { session: false });
	},

	async getSubcategoriesByCategory(req, res) {
		try {
			const { productCategoryUuid } = req.params;

			// Fetch subcategories associated with the given productCategoryUuid
			const subcategories = await db.ProductSubcategory.findAll({
				where: { productCategoryUuid },
				attributes: ['uuid', 'name'] // Adjust attributes as needed
			});

			if (subcategories.length === 0) {
				return res.status(404).json({
					message: "No subcategories found for this category",
					status: "failed"
				});
			}

			res.json({
				message: "Subcategories fetched successfully",
				data: subcategories,
				status: "success"
			});
		} catch (error) {
			console.error("Error fetching subcategories:", error);
			res.status(500).json({
				message: "Failed to fetch subcategories",
				status: "error",
				error: error.message
			});
		}
	}
};

module.exports = ProductCategoryController;
