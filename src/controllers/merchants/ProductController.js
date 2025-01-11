const db = require("../../models");
const { Product, ProductImages, MerchantShop } = db;
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger");

const ProductController = {
    async getProducts(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching products for merchant: ${merchantId}`);

            // Get all merchant's shops
            const shops = await MerchantShop.findAll({
                where: { merchantUuid: merchantId },
                attributes: ['uuid']
            });

            const shopIds = shops.map(shop => shop.uuid);

            // Get products for all merchant's shops
            const products = await Product.findAll({
                where: {
                    merchantShopUuid: shopIds
                },
                include: [
                    {
                        model: ProductImages,
                        attributes: ['imageUrl']
                    },
                    {
                        model: MerchantShop,
                        attributes: ['shopName']
                    },
                    {
                        model: db.ProductCategory,
                        attributes: ['name']
                    },
                    {
                        model: db.ProductSubcategory,
                        attributes: ['name']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/products", {
                title: "Products",
                layout: "layout/merchant-account",
                products,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant products: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    async createProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Creating product for merchant: ${merchantId}`);

            // Validate shop ownership
            const shop = await MerchantShop.findOne({
                where: { 
                    uuid: req.body.merchantShopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                logger.warn(`Invalid shop access attempt by merchant: ${merchantId}`);
                return res.status(403).json({
                    status: "error",
                    message: "You don't have permission to add products to this shop"
                });
            }

            // Create product
            const product = await Product.create({
                uuid: uuidv4(),
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                merchantShopUuid: shop.uuid,
                categoryUuid: req.body.categoryUuid,
                subCategoryUuid: req.body.subCategoryUuid
            });

            // Handle product images
            if (req.files && req.files.length > 0) {
                await Promise.all(req.files.map(file => 
                    ProductImages.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        imageUrl: file.filename,
                        isDefault: false
                    })
                ));
            }

            logger.info(`Product created successfully: ${product.uuid}`);
            return res.status(201).json({
                status: "success",
                message: "Product created successfully",
                data: product
            });
        } catch (error) {
            logger.error(`Error creating product: ${error.message}`, { error });
            return res.status(500).json({
                status: "error",
                message: "Failed to create product"
            });
        }
    },

    async renderCreateProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            
            // Get merchant's shops
            const shops = await MerchantShop.findAll({
                where: { merchantUuid: merchantId },
                raw: true
            });

            // Get product categories
            const categories = await db.ProductCategory.findAll({
                raw: true
            });

            // Get market zones for filtering
            const zones = await db.MarketZones.findAll({
                raw: true
            });
            
            res.render("page/merchant/create-product", {
                title: "Create Product",
                layout: "layout/merchant-account",
                shops,
                categories,
                zones,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error rendering create product page: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    }
};

module.exports = ProductController;