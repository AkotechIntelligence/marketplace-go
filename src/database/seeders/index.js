const Zones = require("./zones");
const MerchantShopData = require("./merchantshop");
const MarketShopCategoryData = require("./categories");
const MerchantData = require("./merchant");
const CurrencyData = require("./currencies");
const db = require("../../models");
const logger = require("../../logger");

async function populateMarketZones() {
    const existingZones = await db.MarketZone.findAll({});
    if (existingZones.length > 0) return;
    logger.info("Populating market zones...");
    await db.MarketZone.bulkCreate(Zones);
    return Zones;
}

async function populateMerchant() {
    const existingMerchants = await db.Merchant.findAll({});
    if (existingMerchants.length > 0) return existingMerchants;
    logger.info("Populating merchants...");
    const merchants = await db.Merchant.bulkCreate(MerchantData);
    return merchants;
}

async function populateMerchantShopCategory() {
    const existingCategories = await db.MerchantShopCategory.findAll();
    if (existingCategories.length > 0) return;
    logger.info("Populating merchant shop categories...");
    await db.MerchantShopCategory.bulkCreate(MarketShopCategoryData);
}

async function populateCurrencies() {
    const existingCurrencies = await db.Currency.findAll();
    if (existingCurrencies.length > 0) return;
    logger.info("Populating currencies...");
    await db.Currency.bulkCreate(CurrencyData);
}

async function populateMerchantShop() {
    const existingShops = await db.MerchantShop.findAll({ raw: true });
    if (existingShops.length > 0) return;

    logger.info("Populating merchant shops...");
    const zones = await populateMarketZones();
    const merchants = await populateMerchant();

    if (zones && merchants && merchants.length > 0) {
        await db.MerchantShop.bulkCreate([
            {
                uuid: uuidv4(),
                shopName: "Valtrine Shop",
                description: "First shop",
                zoneUuid: zones[0].zoneUuid,
                merchantUuid: merchants[0].uuid,
                merchantShopCategoryUuid: MarketShopCategoryData[0].uuid
            }
        ]);
    }
}

async function seedData() {
    try {
        logger.info("Starting data seeding...");
        await populateMarketZones();
        await populateMerchant();
        await populateMerchantShopCategory();
        await populateCurrencies();
        await populateMerchantShop();
        logger.info("Data seeding completed successfully");
    } catch (error) {
        logger.error("Error seeding data:", error);
        throw error;
    }
}

module.exports = {
    seedData,
};