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
            req.flash('error', 'Failed to load shops');
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
            req.flash('error', 'Failed to create shop');
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
    },

    async renderEditShop(req, res) {
        try {
            const { shopUuid } = req.params;
            const merchantId = req.user.uuid;

            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: shopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                req.flash('error', 'Shop not found');
                return res.redirect('/merchant/shops');
            }

            const [zones, categories] = await Promise.all([
                db.MarketZone.findAll(),
                db.MerchantShopCategory.findAll()
            ]);

            res.render("page/merchant/edit-shop", {
                title: "Edit Shop",
                layout: "layout/merchant-account",
                shop,
                zones,
                categories,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error rendering edit shop page: ${error.message}`, { error });
            req.flash('error', 'Failed to load shop edit page');
            res.redirect('/merchant/shops');
        }
    },

    async updateShop(req, res) {
        try {
            const { shopUuid } = req.params;
            const merchantId = req.user.uuid;
            const { shopName, description, zoneUuid, merchantShopCategoryUuid } = req.body;

            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: shopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                req.flash('error', 'Shop not found');
                return res.redirect('/merchant/shops');
            }

            const existingShop = await db.MerchantShop.findOne({
                where: {
                    shopName,
                    uuid: { [db.Sequelize.Op.ne]: shopUuid }
                }
            });

            if (existingShop) {
                req.flash('error', 'A shop with this name already exists');
                return res.redirect(`/merchant/shops/${shopUuid}/edit`);
            }

            await shop.update({
                shopName,
                description,
                zoneUuid,
                merchantShopCategoryUuid,
                imageUrl: req.file ? req.file.filename : shop.imageUrl
            });

            req.flash('success', 'Shop updated successfully');
            res.redirect('/merchant/shops');
        } catch (error) {
            logger.error(`Error updating shop: ${error.message}`, { error });
            req.flash('error', 'Failed to update shop');
            res.redirect(`/merchant/shops/${req.params.shopUuid}/edit`);
        }
    },

    async deleteShop(req, res) {
        try {
            const { shopUuid } = req.params;
            const merchantId = req.user.uuid;

            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: shopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                return res.status(404).json({
                    success: false,
                    message: 'Shop not found'
                });
            }

            // Check if shop has any products
            const productsCount = await db.Product.count({
                where: { merchantShopUuid: shopUuid }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete shop with existing products'
                });
            }

            await shop.destroy();

            res.json({
                success: true,
                message: 'Shop deleted successfully'
            });
        } catch (error) {
            logger.error(`Error deleting shop: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to delete shop'
            });
        }
    },

    async deleteShopImage(req, res) {
        try {
            const { shopUuid } = req.params;
            const merchantId = req.user.uuid;

            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: shopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                return res.status(404).json({
                    success: false,
                    message: 'Shop not found'
                });
            }

            if (shop.imageUrl) {
                // Delete the file using the upload controller
                const uploadController = require("../UploadController");
                await uploadController.deleteFile(`shops/${shop.imageUrl}`);

                await shop.update({ imageUrl: null });
            }

            res.json({
                success: true,
                message: 'Shop image deleted successfully'
            });
        } catch (error) {
            logger.error(`Error deleting shop image: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to delete shop image'
            });
        }
    }
};

module.exports = MerchantShopController;
