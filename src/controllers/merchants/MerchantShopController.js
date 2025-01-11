const db = require("../../models");
const { MerchantShop } = db;
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger");

const MerchantShopController = {
    async getShops(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching shops for merchant: ${merchantId}`);

            const shops = await db.MerchantShop.findAll({
                where: { merchantUuid: merchantId },
                include: [
                    {
                        model: db.MarketZones,
                        attributes: ['name']
                    },
                    {
                        model: db.MerchantShopCategory,
                        attributes: ['name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/shops", {
                title: "My Shops",
                layout: "layout/merchant-account",
                shops,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant shops: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    async createShop(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Creating shop for merchant: ${merchantId}`);

            // Validate input
            const { shopName, description, zoneUuid, merchantShopCategoryUuid } = req.body;
            
            if (!shopName || !description || !zoneUuid || !merchantShopCategoryUuid) {
                return res.status(400).json({
                    status: "error",
                    message: "Missing required fields"
                });
            }

            // Check for existing shop with same name
            const existingShop = await MerchantShop.findOne({ 
                where: { shopName }
            });

            if (existingShop) {
                logger.warn(`Shop name already exists: ${shopName}`);
                return res.status(400).json({
                    status: "error",
                    message: "Shop name already exists"
                });
            }

            // Create shop
            const shop = await db.MerchantShop.create({
                uuid: uuidv4(),
                merchantUuid: merchantId,
                shopName,
                description,
                zoneUuid,
                merchantShopCategoryUuid,
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

module.exports = MerchantShopController;