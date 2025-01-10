const db = require("../models");
const { QueryTypes } = require("sequelize");
const Controller = {};

Controller.getHomePage = async (req, res) => {
	try {
		// Fetch categories and zones separately
		const categories = await db.MerchantShopCategory.findAll({
			raw: true,
			attributes: ['uuid', 'name', 'icon', 'zoneUuid']
		});

		const zones = await db.MarketZones.findAll({
			raw: true,
			attributes: ['uuid', 'zoneUuid', 'name']
		});

		// Join the data in memory
		const categoriesWithZones = categories.map(category => {
			const zone = zones.find(z => z.zoneUuid === category.zoneUuid);
			return {
				...category,
				zoneName: zone ? zone.name : null
			};
		});

		// Get featured products with their images using a JOIN query
		const featuredProducts = await db.sequelize.query(`
			SELECT p.*, pi.imageUrl 
			FROM "Product" p
			LEFT JOIN "ProductImages" pi ON p.uuid = pi."productUuid"
			ORDER BY p."createdAt" DESC
			LIMIT 8
		`, {
			type: QueryTypes.SELECT
		});

		// Group product images by product
		const productsWithImages = featuredProducts.reduce((acc, curr) => {
			if (!acc[curr.uuid]) {
				acc[curr.uuid] = {
					...curr,
					images: []
				};
			}
			if (curr.imageUrl) {
				acc[curr.uuid].images.push({
					imageUrl: curr.imageUrl
				});
			}
			return acc;
		}, {});

		// Convert to array
		const products = Object.values(productsWithImages);

		// Render the homepage with data
		res.render("page/index", {
			title: "Marketplace - Home",
			layout: "layout/index",
			categories: categoriesWithZones,
			zones,
			featuredProducts: products,
			user: req.user
		});
	} catch (error) {
		console.error("Error loading homepage:", error);
		res.render("errors/500", {
			title: "Server Error",
			layout: "layout/blank-layout",
			error: error.message
		});
	}
};

Controller.getAbout = (req, res) => {
	res.render("page/about", {
		title: "About Us",
		layout: "layout/index"
	});
};

Controller.getContact = (req, res) => {
	res.render("page/contact", {
		title: "Contact Us",
		layout: "layout/index"
	});
};

module.exports = Controller;