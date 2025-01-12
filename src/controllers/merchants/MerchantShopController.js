const db = require("../../models");
const logger = require("../../logger");
const { v4: uuidv4 } = require("uuid");

const MerchantShopController = {
    async getShops(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching shops for merchant: ${merchantId}`);

            const shops = await db.MerchantShop.findAll({
                where: { merchantUuid: merchantId },
                include: [
                    {
                        model: db.MarketZone,
                        attributes: ['name']
                    },
                    {
                        model: db.MerchantShopCategory,
                        attributes: ['name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const shopsWithStats = await Promise.all(shops.map(async (shop) => {
                const shopData = shop.get({ plain: true });
                
                // Get products count
                const productsCount = await db.Product.count({
                    where: { merchantShopUuid: shop.uuid }
                });

                // Get orders count - simplified
                const ordersCount = await db.Order.count({
                    where: { merchantUuid: merchantId }
                });

                // Calculate revenue - simplified
                const revenue = await db.Order.sum('total', {
                    where: { merchantUuid: merchantId }
                });

                return {
                    ...shopData,
                    productsCount: productsCount || 0,
                    ordersCount: ordersCount || 0,
                    revenue: revenue || 0
                };
            }));

            res.render("page/merchant/shops", {
                title: "My Shops",
                layout: "layout/merchant-account",
                shops: shopsWithStats,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant shops: ${error.message}`, { error });
            req.flash('error', 'Failed to load shops. Please try again.');
            res.redirect('/merchant');
        }
    },

    async createShop(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Creating shop for merchant: ${merchantId}`);

            const { shopName, description, zoneUuid, merchantShopCategoryUuid } = req.body;
            
            if (!shopName || !description || !zoneUuid || !merchantShopCategoryUuid) {
                req.flash('error', 'Please fill in all required fields');
                return res.redirect('/merchant/shops/create');
            }

            const [zone, category] = await Promise.all([
                db.MarketZone.findOne({ where: { zoneUuid } }),
                db.MerchantShopCategory.findOne({ where: { uuid: merchantShopCategoryUuid } })
            ]);

            if (!zone || !category) {
                req.flash('error', 'Invalid zone or category selected');
                return res.redirect('/merchant/shops/create');
            }

            const existingShop = await db.MerchantShop.findOne({ 
                where: { shopName }
            });

            if (existingShop) {
                req.flash('error', 'A shop with this name already exists');
                return res.redirect('/merchant/shops/create');
            }

            await db.MerchantShop.create({
                uuid: uuidv4(),
                merchantUuid: merchantId,
                shopName,
                description,
                zoneUuid,
                merchantShopCategoryUuid,
                imageUrl: req.file ? req.file.filename : null
            });

            req.flash('success', 'Shop created successfully');
            res.redirect('/merchant/shops');
        } catch (error) {
            logger.error(`Error creating shop: ${error.message}`, { error });
            req.flash('error', 'Failed to create shop. Please try again.');
            res.redirect('/merchant/shops/create');
        }
    },

    async renderCreateShop(req, res) {
        try {
            const zones = await db.MarketZone.findAll();
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
            req.flash('error', 'Failed to load shop creation page');
            res.redirect('/merchant/shops');
        }
    }
};

module.exports = MerchantShopController;