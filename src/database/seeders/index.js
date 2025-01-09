const Zones = require("./zones");
const MerchantShopData = require("./merchantshop");
const MarketShopCategoryData = require("./categories");
const MerchantData = require("./merchant");
const db = require("../../models");
const uuidv4 = require("uuid").v4;

const { MarketZones, MerchantShop, MerchantShopCategory, Merchant } =
	db.sequelize.models;

async function populateMarketZones() {
	const existingZones = MarketZones && (await MarketZones.findAll({}));
	if (existingZones.length > 0) return;

	console.log("MarketZonesData", Zones);
	await MarketZones.bulkCreate(Zones);
	return Zones;
}

async function populateMerchant() {
	const existingZones = Merchant && (await Merchant.findAll({}));
	if (existingZones.length > 0) return;

	await Merchant.bulkCreate(MerchantData, { returning: true });
	//await Merchant.create(MerchantData, { returning: true });
}

async function populateMerchantShop() {
	const existingMerchant =
		MerchantShop && (await MerchantShop.findAll({ raw: true }));
	if (existingMerchant.length > 0) return;
	console.log("MerchantShopData>>", MerchantShopData);
	const data = await populateMarketZones();

	console.log("MerchantZones>>", data);

	if (data) {
		await MerchantShop.bulkCreate(
			[
				{
					uuid: data[0].uuid,
					zoneUuid: data[0].zoneUuid,
					shopName: "Valtrine Shop",
					merchantUuid: MerchantData[0].uuid,
					shopCategoryUuid: MarketShopCategoryData[0].uuid,
				},
			],
			{ returning: true }
		);
	}
}

async function populateMerchantShopCategory() {
	const existingMerchantShopcategories =
		MerchantShopCategory && (await MerchantShopCategory.findAll());
	if (existingMerchantShopcategories.length > 0) return;

	console.log("MarketShopCategoryData", MarketShopCategoryData);

	await MerchantShopCategory.bulkCreate(MarketShopCategoryData, {
		returning: true,
	});
}

async function seedData() {
	await populateMerchantShop();
	// populateMarketZones();
	await populateMerchant();
	await populateMerchantShopCategory();
}

module.exports = {
	seedData,
};
