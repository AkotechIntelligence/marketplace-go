const fs = require("fs");
const path = require("path");
const Zones = require("./zones");
const MerchantShopData = require("./merchantshop");
const MarketShopCategoryData = require("./categories");
const MerchantData = require("./merchant");
const CurrencyData = require("./currencies");
const ProductCategoryData = require("./product-categories");
const ProductSubcategoryData = require("./product-subcategories");
const SampleMerchantData = require("./sample-merchant-data");
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
    if (existingCategories.length > 0) return existingCategories;
    logger.info("Populating merchant shop categories...");
    const categories = await db.MerchantShopCategory.bulkCreate(MarketShopCategoryData);
    return categories;
}

async function populateProductCategories() {
    const existingCategories = await db.ProductCategory.findAll();
    if (existingCategories.length > 0) return existingCategories;
    
    // Get first zone and merchant shop category for reference
    const zone = await db.MarketZone.findOne();
    const merchantShopCategory = await db.MerchantShopCategory.findOne();
    
    if (!zone || !merchantShopCategory) {
        throw new Error("Zone and merchant shop category must exist before creating product categories");
    }
    
    // Set references
    ProductCategoryData.forEach(category => {
        category.zoneUuid = zone.zoneUuid;
        category.merchantShopCategoryUuid = merchantShopCategory.uuid;
    });
    
    logger.info("Populating product categories...");
    const categories = await db.ProductCategory.bulkCreate(ProductCategoryData);
    return categories;
}

async function populateProductSubcategories() {
    const existingSubcategories = await db.ProductSubcategory.findAll();
    if (existingSubcategories.length > 0) return existingSubcategories;
    
    // Get product categories
    const categories = await db.ProductCategory.findAll();
    if (categories.length < 2) {
        throw new Error("Product categories must exist before creating subcategories");
    }
    
    // Map subcategories to categories
    const [electronicsCategory, fashionCategory] = categories;
    
    ProductSubcategoryData[0].productCategoryUuid = electronicsCategory.uuid; // Smartphones
    ProductSubcategoryData[1].productCategoryUuid = electronicsCategory.uuid; // Laptops
    ProductSubcategoryData[2].productCategoryUuid = fashionCategory.uuid; // Men's Clothing
    ProductSubcategoryData[3].productCategoryUuid = fashionCategory.uuid; // Women's Clothing
    
    logger.info("Populating product subcategories...");
    const subcategories = await db.ProductSubcategory.bulkCreate(ProductSubcategoryData);
    return subcategories;
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
        await populateProductCategories();
        await populateProductSubcategories();
        
        // Only seed sample data after all other data is seeded
        await SampleMerchantData.seedSampleData();
        
        logger.info("Data seeding completed successfully");
    } catch (error) {
        logger.error("Error seeding data:", error);
        throw error;
    }
}

module.exports = {
    seedData,
};