const db = require("../models");
const {
	Product,
	ProductImages,
	ProductCategory,
	MerchantShopCategory,
	ProductSubcategory,
} = db.sequelize.models;
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");
const ProductController = {
	async createProduct(req, res) {
		/// Validate Input
		console.log("req body", req.body);

		const createproductSchema = z.object({
			slug: z.string().optional(),
			name: z
				.string({
					message: " Name is required and must be 3 or more characters long",
				})
				.min(3),
			description: z
				.string({ message: "Description is required and cannot be empty" })
				.min(1),
			price: z.string({ message: "Price is require" }),
			quantity: z.string({
				message: "Quantity must be a non-negative integer",
			}),
			// zoneUuid: z
			// 	.string({ message: "Market zone is required" })
			// 	.uuid({ message: "Market zone is required" }),
			merchantShopUuid: z
				.string({ message: "Merchant shop is required" })
				.uuid(),
			categoryUuid: z
				.string({ message: "Product Category is required" })
				.uuid(),
			subCategoryUuid: z
				.string({ message: "Product Sub category is required" })
				.uuid(),
		});

		const validateBody = createproductSchema.safeParse(req.body);

		if (!validateBody.success) {
			const errorMsg = validateBody?.error?.errors.map((r) => {
				return `${r.path.map((b) => {
					if (typeof b === "string") {
						return b;
					}
					return " ";
				})} : ${r.message} `;
			});

			return res.status(400).json({ message: errorMsg[0], status: "failed" });
		}

		const { name, merchantShopUuid } = req.body;

		const findProductCategory = await Product.findOne({
			where: { name, merchantShopUuid },
		});

		if (findProductCategory) {
			return res.status(403).json({
				message: "Product  already exist",
			});
		}
		const product = await Product.create({
			uuid: uuidv4(),
			name: req.body.title,
			...req.body,
		});

		if (Array.isArray(req.files)) {
			await Promise.all(
				req.files.map(async (files) => {
					await ProductImages.create({
						uuid: uuidv4(),
						type: "image",
						imageUrl: files.filename,
						productUuid: product.uuid,
						default: false,
					});
				})
			);
		}
		return res.status(201).json({
			message: "Product successfully created",
			status: "success",
			data: product,
		});
		// res.render("page/home", { session: false });
	},

	async addProductImage(req, res) {
		const { productUuid } = req.body;

		const findProduct = await Product.findOne({
			where: { uuid: productUuid },
		});

		if (!findProduct) {
			return res.status(404).json({
				message: "Product not found",
			});
		}
		const product = await ProductImages.create({
			uuid: uuidv4(),
			default: false,
			...req.body,
		});

		res.json({
			message: "done",
			data: product,
		});
		// res.render("page/home", { session: false });
	},

	async editProduct(req, res) {
		const createproductSchema = z.object({
			slug: z.string().optional(),
			name: z
				.string({
					message: " Name is required and must be 3 or more characters long",
				})
				.min(3),
			description: z
				.string({ message: "Description is required and cannot be empty" })
				.min(1),
			price: z.string({ message: "Price is require" }),
			quantity: z.string({
				message: "Quantity must be a non-negative integer",
			}),
			// zoneUuid: z
			// 	.string({ message: "Market zone is required" })
			// 	.uuid({ message: "Market zone is required" }),
			merchantShopUuid: z
				.string({ message: "Merchant shop is required" })
				.uuid(),
			categoryUuid: z
				.string({ message: "Product Category is required" })
				.uuid(),
			subCategoryUuid: z
				.string({ message: "Product Sub category is required" })
				.uuid(),
		});

		const validateBody = createproductSchema.safeParse(req.body);

		if (!validateBody.success) {
			const errorMsg = validateBody?.error?.errors.map((r) => {
				return `${r.path.map((b) => {
					if (typeof b === "string") {
						return b;
					}
					return " ";
				})} : ${r.message} `;
			});

			return res.status(400).json({ message: errorMsg[0], status: "failed" });
		}

		try {
			const productService = await Product.findOne({
				where: { uuid: req.params.id },
				raw: true,
			});
			if (productService) {
				const query = `
					UPDATE public."Product"
					SET
						name = :name,
						description = :description,
						price=:price,
						quantity=:quantity,
						merchant_shop_uuid=:merchantShopUuid,
						category_uuid=:categoryUuid,
						sub_category_uuid=:subCategoryUuid

					WHERE
						uuid = :uuid
					`;
				const [rowsUpdated, _] = await db.sequelize.query(query, {
					replacements: {
						uuid: req.params.id,
						name: req.body.name,
						description: req.body.description,
						price: req.body.price,
						quantity: req.body.quantity,
						merchantShopUuid: req.body.merchantShopUuid,
						categoryUuid: req.body.categoryUuid,
						subCategoryUuid: req.body.subCategoryUuid,
					},
				});

				console.log("rowsUpdated", rowsUpdated);

				if (Array.isArray(req.files)) {
					await Promise.all(
						req.files.map(async (files) => {
							await ProductImages.create({
								uuid: uuidv4(),
								type: "image",
								imageUrl: files.filename,
								productUuid: productService.uuid,
								default: false,
							});
						})
					);
				}

				return res.status(201).json({
					message: "Product edited successfully",
					status: "success",
					data: { product: productService },
				});
			}
		} catch (error) {
			console.log("error", error);
		}
	},

	async deleteProductImagebyId(req, res) {
		console.log("req delete user", req.params);
		try {
			if (!req.params.id) {
				throw new Error("Id is null");
			}

			let productImage = await ProductImages.findOne({
				where: { id: req.params.id },
			});

			if (!productImage) {
				return res.status(404).json({
					message:
						"Profile not found. Please create a profile before you can add a product",
					status: "failed",
				});
			}

			await productImage.destroy();

			return res
				.status(200)
				.json({ message: "Image deleted successfully", status: "success" });
		} catch (error) {
			console.log("error", error);
			res.render("errors/500", {
				title: "Server Error",
				layout: "layout/index",
			});
		}
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
			const existingProduct = await Product.findOne({
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
				message: "Product deleted successfully",
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

	async getProduct(req, res) {
		if (!req.params.productuuid) {
			return res.render("errors/404", {
				title: "Ad not found",
				layout: "layout/index",
			});
		}

		const product = await Product.findOne({
			where: { uuid: req.params.productuuid },
			raw: true,
		});
		product.category = await ProductCategory.findOne({
			where: { uuid: product.categoryUuid },
			raw: true,
		});

		product.subcategory = await ProductSubcategory.findOne({
			where: { uuid: product.subCategoryUuid },
			raw: true,
		});

		product.merchantShopCategory = await MerchantShopCategory.findOne({
			where: { uuid: product.merchantShopCategoryUuid },
			raw: true,
		});

		product.productImages = await ProductImages.findAll({
			where: { productUuid: product.uuid },
			raw: true,
		});

		console.log("product>>", product);

		res.render("page/singleproductpage", {
			title: product.name,
			layout: "layout/zonebyid",
			product,
		});
		// res.render("page/home", { session: false });
	},
};

module.exports = ProductController;
