const db = require("../models");
const { ProductSubcategory } = db.sequelize.models;
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");
const ProductSubCategoryController = {
	async createProductSubCategory(req, res) {
		const { name, productCategoryUuid } = req.body;

		console.log("rebody", req.body);
		const findProductSubCategory = await ProductSubcategory.findOne({
			where: { name, productCategoryUuid },
		});

		if (findProductSubCategory) {
			return res.status(403).json({
				message: "Product subcategory already exist",
			});
		}
		const productCategory = await ProductSubcategory.create({
			uuid: uuidv4(),
			name,
			productCategoryUuid,
		});

		res.json({
			status: "success",
			message: "Product Sub Category successfully added",
		});
		// res.render("page/home", { session: false });
	},

	async getProductSubCategoryByProductId(req, res) {
		console.log("req parmas", req.params);

		const findShop = await ProductSubcategory.findAll({
			where: { productCategoryUuid: req.params.productId },
			raw: true,
		});

		res.json({
			message: "done",
			data: findShop,
		});

		// res.render("page/home", { session: false });
	},

	async editProductSubCategory(req, res) {
		try {
			const findShop = await ProductSubcategory.findOne({
				where: { uuid: req.params.id },
			});
			if (!findShop) {
				return res.status(404).json({
					message: "Product category does not exist",
				});
			}
			console.log("req.body", req.body);

			const query = `
					UPDATE public."ProductSubcategory"
					SET
						name = :name,
						product_category_uuid=:product_category_uuid
						WHERE
						uuid = :uuid
					`;
			const [rowsUpdated, _] = await db.sequelize.query(query, {
				replacements: {
					uuid: req.params.id,
					name: req.body.name,

					product_category_uuid: req.body.productCategoryUuid,
				},
			});

			return res.status(200).json({
				message: "Product Sub Category successfully updated",
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

	async deleteProdutCategoryById(req, res) {
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
			const existingProduct = await ProductSubcategory.findOne({
				where: {
					uuid: req.params.id,
				},
			});

			if (existingProduct && !existingProduct.dataValues) {
				return res
					.status(400)
					.json({ error: "Category with id provided does not exist" });
			}

			await existingProduct.destroy();

			return res.status(200).json({
				message: "Product Sub Category deleted successfully",
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

module.exports = ProductSubCategoryController;
