const db = require("../models");
const { MerchantShopCategory, MerchantShop, Product } = db.sequelize.models;
const { v4: uuidv4 } = require("uuid");
const MerchantShopCategoryController = {
	async createMerchantShopCategory(req, res) {
		const { name, description, zoneUuid, icon } = req.body;

		const findShop = await MerchantShopCategory.findOne({
			where: { name, zoneUuid },
		});
		if (findShop) {
			return res.status(403).json({
				message: "Shop category already exist",
			});
		}
		await MerchantShopCategory.create({
			uuid: uuidv4(),
			...req.body,
		});
		res.json({
			status: "success",
			message: "Merchant Shop Category successfully created",
		});

		// res.render("page/home", { session: false });
	},

	async getMerchantShopByZoneId(req, res) {
		console.log("req parmas", req.params);

		const findShop = await MerchantShopCategory.findAll({
			where: { zoneUuid: req.params.zoneuuid },
			raw: true,
		});

		res.json({
			message: "done",
			data: findShop,
		});

		// res.render("page/home", { session: false });
	},

	async editMerchantShopCategory(req, res) {
		try {
			console.log("req.byd", req.body);

			const findShop = await MerchantShopCategory.findOne({
				where: { uuid: req.params.id },
			});
			if (!findShop) {
				return res.status(404).json({
					message: "Merchant Shop Category does not exist",
				});
			}

			const query = `
					UPDATE public."MerchantShopCategory"
					SET
						name = :name,
						description = :description,
						
						zone_uuid=:zoneUuid,
						icon=:icon
	
					WHERE
						uuid = :uuid
					`;
			const [rowsUpdated, _] = await db.sequelize.query(query, {
				replacements: {
					uuid: req.params.id,

					name: req.body.name,
					description: req.body.description,
					zoneUuid: req.body.zoneUuid,
					icon: req.body.icon,
				},
			});

			return res.status(200).json({
				message: "Merchant Shop Category successfully updated",
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

	async deleteMerchantShopCategoryById(req, res) {
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
			console.log("paramsxx", req.params.id);
			const existingShop = await MerchantShopCategory.findOne({
				where: { uuid: req.params.id },
			});

			if (!existingShop) {
				return res
					.status(400)
					.json({ error: "Merchant shop with id provided does not exist" });
			}

			// Find if Merchant Category is tied to
			const foundMerchantShop = await MerchantShop.findOne({
				where: {
					merchantShopCategoryUuid: existingShop.merchantShopCategoryUuid,
				},
			});

			if (foundMerchantShop) {
				return res.status(400).json({
					status: "failed",
					message:
						"Permssion denied. Some Merchant shops rely on this category ",
				});
			}

			// Find if Merchant Category is tied to
			const foundProduct = await Product.findOne({
				where: {
					merchantShopCategoryUuid: existingShop.merchantShopCategoryUuid,
				},
			});

			if (foundProduct) {
				return res.status(400).json({
					status: "failed",
					message: "Permssion denied. Some Products rely on this category ",
				});
			}

			await existingShop.destroy();

			return res.status(200).json({
				message: "Merchant Shop deleted successfully",
				status: "success",
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

module.exports = MerchantShopCategoryController;
