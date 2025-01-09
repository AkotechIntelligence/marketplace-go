const db = require("../models");
const { ProductCategory, ProductSubcategory } = db.sequelize.models;
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

	async deleteProdutcById(req, res) {
		const categoryParamSchema = z.object({
			id: z.string().min(4),
		});

		const validateParams = categoryParamSchema.safeParse(req.params);

		if (!validateParams.success) {
			return res.status(400).json({
				error: "Invalid data",
				status: "failed",
				message: validateParams.error.erros,
			});
		}

		try {
			// Check if category already exists by name
			const existingProduct = await ProductCategory.findOne({
				where: {
					uuid: req.params.id,
				},
			});

			if (existingProduct && !existingProduct.dataValues) {
				return res
					.status(400)
					.json({ error: "Category with id provided does not exist" });
			}

			const foundProduct = await Product.findOne({
				where: {
					categoryUuid: existingProduct.dataValues.uuid,
				},
			});

			if (foundProduct) {
				return res.status(400).json({
					status: "failed",
					message: "Permssion denied. Some Products rely on this category ",
				});
			}

			const foundProductSubCategory = await ProductSubcategory.findOne({
				where: {
					productCategoryUuid: existingProduct.dataValues.uuid,
				},
			});

			if (foundProductSubCategory) {
				return res.status(400).json({
					status: "failed",
					message:
						"Permssion denied. Some Product sub category rely on this category ",
				});
			}

			await existingProduct.destroy();

			return res.status(200).json({
				message: "Product Category deleted successfully",
				status: "success",
				data: existingProduct,
			});
		} catch (error) {
			console.log("error>>", error);
			res.status(400).json({
				status: "error",
				message: error.message,
			});
		}
	},
};

module.exports = ProductCategoryController;
