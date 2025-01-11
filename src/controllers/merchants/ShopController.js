const db = require("../../models");
const { MerchantShop } = db;
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger");

const ShopController = {
    async createShop(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Creating shop for merchant: ${merchantId}`);

            const existingShop = await MerchantShop.findOne({
                where: { shopName: req.body.shopName }
            });

            if (existingShop) {
                logger.warn(`Shop name already exists: ${req.body.shopName}`);
                return res.status(400).json({
                    status: "error",
                    message: "Shop name already exists"
                });
            }

            const shop = await MerchantShop.create({
                uuid: uuidv4(),
                merchantUuid: merchantId,
                shopName: req.body.shopName,
                description: req.body.description,
                zoneUuid: req.body.zoneUuid,
                merchantShopCategoryUuid: req.body.categoryUuid,
                imageUrl: req.file ? req.file.filename : null
            });

            logger.info(`Shop created successfully: ${shop.uuid}`);
            return res.status(201).json({
                status: "success",
                message: "Shop created successfully",
                data: shop
            });
        } catch (error) {
            logger.error(`Error creating shop: ${error.message}`, { error });
            return res.status(500).json({
                status: "error",
                message: "Failed to create shop"
            });
        }
    },

    async renderCreateShop(req, res) {
        try {
            // Get zones and categories
            const zones = await db.MarketZones.findAll();
            const categories = await db.MerchantShopCategory.findAll();

            res.render("page/merchant/create-shop", {
                title: "Create Shop",
                layout: "layout/merchant-account",
                zones,
                categories,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error rendering create shop page: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    }
};

module.exports = ShopController;