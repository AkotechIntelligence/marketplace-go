const { QueryTypes } = require("sequelize");
const db = require("../models");
const logger = require("../logger");

const MarketZoneController = {
	async createMarketZone(req, res) {
		try {
			const { name, description } = req.body;
			const marketZone = await db.MarketZone.create({ name, description });
			res.json({
				message: "done",
				data: marketZone
			});
		} catch (error) {
			logger.error("Error creating market zone:", error);
			res.status(500).json({
				message: "Error creating market zone",
				error: error.message
			});
		}
	},

	async getAllZones(req, res) {
		try {
			const zones = await db.MarketZone.findAll({
				include: [
					{
						model: db.MerchantShop,
					},
				],
			});
			res.json({
				data: zones,
				message: "Data successfully retrieved",
				status: "success",
			});
		} catch (error) {
			logger.error("Error fetching zones:", error);
			res.status(500).json({
				message: "Error fetching zones",
				error: error.message
			});
		}
	},

	async renderZoneById(req, res) {
		try {
			const id = req.params.id;
			const zone = await db.MarketZone.findOne({
				where: {
					zoneUuid: id,
				},
				raw: true,
			});

			if (!zone) {
				return res.redirect("/");
			}

			const categories = await db.sequelize.query(
				`SELECT msc.*, mz.name AS zone_name
				FROM "MerchantShopCategory" msc
				JOIN "MarketZone" mz ON msc.zone_uuid = mz.zone_uuid
				WHERE msc.zone_uuid = :zoneUuid`,
				{ 
					replacements: { zoneUuid: zone.zoneUuid },
					type: QueryTypes.SELECT 
				}
			);

			res.locals.categories = categories;

			const merchantShops = await db.MerchantShop.findAll({
				where: { zoneUuid: id },
			});

			const shopIds = merchantShops.map(shop => `'${shop.uuid}'`).join(",");

			let products = [];
			if (shopIds.length > 0) {
				products = await db.sequelize.query(
					`SELECT * FROM "Product" WHERE "merchant_shop_uuid" IN (${shopIds})`,
					{
						type: QueryTypes.SELECT,
						raw: true,
					}
				);

				// Add images to products
				products = await Promise.all(products.map(async (product) => {
					const images = await db.ProductImage.findAll({
						where: { productUuid: product.uuid },
					});
					return {
						...product,
						images,
					};
				}));
			}

			res.render("page/zonebyId", {
				title: zone.name,
				layout: "layout/zonebyid",
				products: products,
			});
		} catch (error) {
			logger.error("Error rendering zone:", error);
			res.render("errors/500", {
				title: "Server Error",
				layout: "layout/blank-layout",
				error: error.message
			});
		}
	},

	async getPageByMerchantId(req, res) {
		try {
			const id = req.params.id;
			const category = await db.MerchantShopCategory.findOne({
				where: {
					uuid: id,
				},
				raw: true,
			});

			if (!category) {
				return res.redirect("/");
			}

			const categories = await db.sequelize.query(
				`SELECT msc.*, mz.name AS zone_name
				FROM "MerchantShopCategory" msc
				JOIN "MarketZone" mz ON msc.zone_uuid = mz.zone_uuid
				WHERE msc.zone_uuid = :zoneUuid`,
				{ 
					replacements: { zoneUuid: category.zoneUuid },
					type: QueryTypes.SELECT 
				}
			);

			res.locals.categories = categories;

			const products = await db.Product.findAll({
				where: { merchantShopCategoryUuid: id },
				raw: true,
			});

			// Add images to products
			const productsWithImages = await Promise.all(products.map(async (product) => {
				const images = await db.ProductImage.findAll({
					where: { productUuid: product.uuid },
				});
				return {
					...product,
					images,
				};
			}));

			res.render("page/zonebyId", {
				title: category.name,
				layout: "layout/zonebyid",
				products: productsWithImages,
			});
		} catch (error) {
			logger.error("Error getting merchant page:", error);
			res.render("errors/500", {
				title: "Server Error",
				layout: "layout/blank-layout",
				error: error.message
			});
		}
	},
};

module.exports = MarketZoneController;