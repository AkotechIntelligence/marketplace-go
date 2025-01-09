const { QueryTypes } = require("sequelize");
const db = require("../models");

const {
	MarketZones,
	ProductCategory,
	ProductImages,
	ProductSubcategory,
	ProductSubSubcategory,
	MerchantShop,
	MerchantShopCategory,
} = db.sequelize.models;
const MarketZoneController = {
	async createMarketZone(req, res) {
		const { name, description } = req.body;
		const marketZone = await MarketZones.create({ name, description });
		await marketZone.save();
		res.json({
			message: "done",
		});
		// res.render("page/home", { session: false });
	},

	async getAllZones(req, res) {
		const mzone = await MarketZones.findAll({
			include: [
				{
					model: MerchantShop,
				},
			],
		});
		res.json({
			data: mzone,
			message: "Data successfully retrieved",
			status: "success",
		});
	},

	async renderZoneById(req, res) {
		const id = req.params.id;
		const findByUUID = await MarketZones.findOne({
			where: {
				zone_uuid: id,
			},
			raw: true,
		});

		if (!findByUUID) {
			return res.redirect("/");
		}

		///Get necessary categories

		const result = await db.sequelize.query(
			`SELECT msc.*, mz.name AS zone_name
		FROM "MerchantShopCategory" msc
		JOIN "MarketZones" mz ON msc.zone_uuid = mz.zone_uuid
		and msc."zone_uuid"='${findByUUID.zoneUuid}'
		`,
			{ type: QueryTypes.SELECT, raw: true }
		);
		console.log("result>>", result);
		res.locals.categories = result;

		// GET ALL SHOPS
		const merchantShop = await MerchantShop.findAll({
			where: { zoneUuid: id },
		});

		console.log("merchantShop>>>", merchantShop);
		const allMerchantShopMatchingZoneId = merchantShop
			.map((r) => `'${r.uuid}'`)
			.join(",");

		/// GET ALL PRODUCTS BASED ON ZONES

		// const products = await sequelize.query(
		// 	`SELECT
		// 	p.uuid AS product_uuid,
		// 	p.slug,
		// 	p.name,
		// 	p.description,
		// 	p.price,
		// 	p.quantity,
		// 	p.zone_uuid,
		// 	p.merchant_shop_category_uuid,
		// 	p.category_uuid,
		// 	p.sub_category_uuid,
		// 	pi.id AS image_uuid,
		// 	pi.image_url
		//  FROM
		// 	"Product" p
		//  LEFT JOIN
		// 	"ProductImages" pi ON p."uuid" = pi."product_uuid"
		//  WHERE
		// 	p."zone_uuid" =:zoneUuid`,
		// 	{
		// 		replacements: { zoneUuid: findByUUID.zoneUuid },
		// 		type: QueryTypes.SELECT,
		// 	}
		// );

		console.log("allMerchantShopMatchingZoneId", allMerchantShopMatchingZoneId);
		let products;
		if (allMerchantShopMatchingZoneId.length > 0) {
			products = await db.sequelize.query(
				`SELECT *
			 FROM
				"Product"
			 WHERE
				"merchant_shop_uuid" in(${allMerchantShopMatchingZoneId})`,
				{
					type: QueryTypes.SELECT,
					raw: true,
				}
			);
		} else {
			products = await db.sequelize.query(
				`SELECT *
			 FROM
				"Product"
			 WHERE
			1=0`,
				{
					type: QueryTypes.SELECT,
					raw: true,
				}
			);
		}

		console.log("products>>", products);
		// add Images
		const productsWithImages = await Promise.all(
			products.map(async (r) => {
				const images = await ProductImages.findAll({
					where: {
						productUuid: r.uuid,
					},
				});
				return {
					...r,
					images,
				};
			})
		);

		console.log("productsWithImages", productsWithImages);
		res.render("page/zonebyId", {
			title: `${findByUUID.name}`,
			layout: "layout/zonebyid",
			products: productsWithImages,
		});
	},

	async getPageByMerchantId(req, res) {
		const id = req.params.id;
		const findByUUID = await MerchantShopCategory.findOne({
			where: {
				uuid: id,
			},
			raw: true,
		});

		if (!findByUUID) {
			return res.redirect("/");
		}

		///Get necessary categories

		const result = await db.sequelize.query(
			`SELECT msc.*, mz.name AS zone_name
		FROM "MerchantShopCategory" msc
		JOIN "MarketZones" mz ON msc.zone_uuid = mz.zone_uuid
		and msc."zone_uuid"='${findByUUID.zoneUuid}'
		`,
			{ type: QueryTypes.SELECT, raw: true }
		);
		console.log("result>>", result);
		res.locals.categories = result;

		const products = await db.sequelize.query(
			`SELECT *
		 FROM
			"Product"
		 WHERE
			"merchant_shop_category_uuid" ='${id}'`,
			{
				type: QueryTypes.SELECT,
				raw: true,
			}
		);
		console.log("products>>", products);
		// add Images
		const productsWithImages = await Promise.all(
			products.map(async (r) => {
				const images = await ProductImages.findAll({
					where: {
						productUuid: r.uuid,
					},
				});
				return {
					...r,
					images,
				};
			})
		);

		console.log("productsWithImages", productsWithImages);
		res.render("page/zonebyId", {
			title: `${findByUUID.name}`,
			layout: "layout/zonebyid",
			products: productsWithImages,
		});
	},
};

module.exports = MarketZoneController;
