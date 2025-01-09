const db = require("../models");

const { MerchantShop } = db.sequelize.models;
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { z } = require("zod");
const MerchantShopController = {
	async createMerchantShop(req, res) {
		try {
			const {
				merchantUuid,
				shopName,
				description,
				zoneUuid,
				merchantShopCategoryUuid,
			} = req.body;

			console.log("req.byd", req.body);

			const findShop = await MerchantShop.findOne({
				where: { shopName },
			});
			if (findShop) {
				return res.status(403).json({
					message: "Shop already exist",
				});
			}

			console.log("req files>>", req.files, req.file);
			await MerchantShop.create({
				uuid: uuidv4(),
				...req.body,
				imageUrl: req.file ? req.file.filename : "",
			});

			return res.status(201).json({
				message: "Merchant  Shop successfully created",
				status: "success",
			});
		} catch (error) {
			console.log("error", error);
			return res.status(201).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},

	async editMerchantShop(req, res) {
		try {
			console.log("req.byd", req.body);

			const findShop = await MerchantShop.findOne({
				where: { uuid: req.params.id },
			});
			if (!findShop) {
				return res.status(404).json({
					message: "Shop does not exist",
				});
			}

			const query = `
					UPDATE public."MerchantShop"
					SET
						shop_name = :name,
						description = :description,

						zone_uuid=:zoneUuid,
						merchant_shop_category_uuid=:merchantShopCategoryUuid,
						merchant_uuid=:merchantUuid,
						image_url=:image_url

					WHERE
						uuid = :uuid
					`;
			const [rowsUpdated, _] = await db.sequelize.query(query, {
				replacements: {
					uuid: req.params.id,
					merchantUuid: req.body.merchantUuid,
					name: req.body.shopName,
					description: req.body.description,
					zoneUuid: req.body.zoneUuid,
					merchantShopCategoryUuid: req.body.merchantShopCategoryUuid,
					image_url: req.file
						? req.file.filename
						: findShop.dataValues.imageUrl,
				},
			});

			return res.status(201).json({
				message: "Merchant  Shop successfully updated",
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

	async deleteMerchantShopById(req, res) {
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
			const existingShop = await MerchantShop.findOne({
				where: { uuid: req.params.id },
			});

			if (!existingShop.dataValues?.uuid) {
				return res
					.status(400)
					.json({ error: "Merchant shop with id provided does not exist" });
			}

			if (!existingShop.merchantUuid == req.user.uuid) {
				res.status(403).json({
					status: "error",
					message: "Forbidden",
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

	async deleteMerchantShopImage(req, res) {
		try {
			console.log("req.byd", req.body);

			const findShop = await MerchantShop.findOne({
				where: { uuid: req.params.id },
			});
			if (!findShop) {
				return res.status(404).json({
					message: "Merchant Shop not found",
				});
			}

			const imageUrl = findShop.imageUrl;

			if (imageUrl) {
				// Construct the file path
				const filePath = path.join(
					__dirname,
					"../../public/uploads",
					path.basename(imageUrl)
				);

				// Delete the file
				fs.unlink(filePath, async (err) => {
					if (err) {
						console.log("err", err);
						return res
							.status(500)
							.json({ error: "Failed to delete the image file" });
					}

					// Update the imageUrl column to null
					findShop.imageUrl = null;
					findShop.save();
					return res.status(200).json({
						message: "Merchant  Shop deleted successfully",
						status: "success",
					});
				});
			}
		} catch (error) {
			console.log("error", error);
			return res.status(201).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},
};

module.exports = MerchantShopController;
