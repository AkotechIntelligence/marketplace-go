const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger");

const ProductController = {
    async getProducts(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { shopUuid } = req.params;
            
            let where = {};
            let shop = null;

            if (shopUuid) {
                shop = await db.MerchantShop.findOne({ 
                    where: { 
                        uuid: shopUuid,
                        merchantUuid: merchantId 
                    }
                });

                if (!shop) {
                    req.flash('error', 'Shop not found');
                    return res.redirect('/merchant/products');
                }

                where.merchantShopUuid = shopUuid;
            } else {
                // Get all shops for this merchant
                const shops = await db.MerchantShop.findAll({
                    where: { merchantUuid: merchantId },
                    attributes: ['uuid']
                });
                where.merchantShopUuid = shops.map(shop => shop.uuid);
            }

            const products = await db.Product.findAll({
                where,
                include: [
                    {
                        model: db.ProductImage,
                        as: 'images'
                    },
                    {
                        model: db.MerchantShop,
                        attributes: ['shopName']
                    },
                    {
                        model: db.ProductCategory,
                        as: 'category'
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/products", {
                title: "Products",
                layout: "layout/merchant-account",
                products,
                shop,
                shopUuid,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching products: ${error.message}`, { error });
            req.flash('error', 'Failed to load products');
            res.redirect('/merchant');
        }
    },

    async renderCreateProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { shopUuid } = req.params;

            // Get merchant's shops
            const shops = await db.MerchantShop.findAll({
                where: { merchantUuid: merchantId }
            });

            // Get categories
            const categories = await db.ProductCategory.findAll();

            res.render("page/merchant/create-product", {
                title: "Create Product",
                layout: "layout/merchant-account",
                shops,
                categories,
                shopUuid,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error rendering create product page: ${error.message}`, { error });
            req.flash('error', 'Failed to load product creation page');
            res.redirect('/merchant/products');
        }
    },

    async createProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            const {
                name,
                description,
                price,
                quantity,
                merchantShopUuid,
                categoryUuid,
                subCategoryUuid
            } = req.body;

            // Validate shop ownership
            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: merchantShopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to add products to this shop"
                });
            }

            // Create product
            const product = await db.Product.create({
                uuid: uuidv4(),
                name,
                description,
                price,
                quantity,
                merchantShopUuid,
                categoryUuid,
                subCategoryUuid
            });

            // Handle product images
            if (req.files && req.files.length > 0) {
                await Promise.all(req.files.map(file => 
                    db.ProductImage.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        imageUrl: file.filename,
                        isDefault: false
                    })
                ));
            }

            req.flash('success', 'Product created successfully');
            res.redirect('/merchant/products');
        } catch (error) {
            logger.error(`Error creating product: ${error.message}`, { error });
            req.flash('error', 'Failed to create product');
            res.redirect('/merchant/products/create');
        }
    }
};

module.exports = ProductController;