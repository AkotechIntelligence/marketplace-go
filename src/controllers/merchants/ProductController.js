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
                subCategoryUuid,
                currencyCode = 'GHS' // Default to GHS if not specified
            } = req.body;

            // Validate shop ownership
            const shop = await db.MerchantShop.findOne({
                where: { 
                    uuid: merchantShopUuid,
                    merchantUuid: merchantId
                }
            });

            if (!shop) {
                req.flash('error', "You don't have permission to add products to this shop");
                return res.redirect('/merchant/products/create');
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
                subCategoryUuid,
                currencyCode
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
    },

    async renderEditProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { productUuid } = req.params;

            const product = await db.Product.findOne({
                where: { uuid: productUuid },
                include: [
                    {
                        model: db.ProductImage,
                        as: 'images'
                    },
                    {
                        model: db.MerchantShop,
                        where: { merchantUuid: merchantId }
                    }
                ]
            });

            if (!product) {
                req.flash('error', 'Product not found or access denied');
                return res.redirect('/merchant/products');
            }

            const [shops, categories] = await Promise.all([
                db.MerchantShop.findAll({ where: { merchantUuid: merchantId } }),
                db.ProductCategory.findAll()
            ]);

            res.render("page/merchant/edit-product", {
                title: "Edit Product",
                layout: "layout/merchant-account",
                product,
                shops,
                categories,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error rendering edit product page: ${error.message}`, { error });
            req.flash('error', 'Failed to load product edit page');
            res.redirect('/merchant/products');
        }
    },

    async updateProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { productUuid } = req.params;
            const {
                name,
                description,
                price,
                quantity,
                merchantShopUuid,
                categoryUuid,
                subCategoryUuid,
                currencyCode
            } = req.body;

            // Verify product ownership
            const product = await db.Product.findOne({
                where: { uuid: productUuid },
                include: [{
                    model: db.MerchantShop,
                    where: { merchantUuid: merchantId }
                }]
            });

            if (!product) {
                req.flash('error', 'Product not found or access denied');
                return res.redirect('/merchant/products');
            }

            // Update product
            await product.update({
                name,
                description,
                price,
                quantity,
                merchantShopUuid,
                categoryUuid,
                subCategoryUuid,
                currencyCode
            });

            // Handle new images
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

            req.flash('success', 'Product updated successfully');
            res.redirect('/merchant/products');
        } catch (error) {
            logger.error(`Error updating product: ${error.message}`, { error });
            req.flash('error', 'Failed to update product');
            res.redirect(`/merchant/products/${req.params.productUuid}/edit`);
        }
    },

    async deleteProduct(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { productUuid } = req.params;

            const product = await db.Product.findOne({
                where: { uuid: productUuid },
                include: [{
                    model: db.MerchantShop,
                    where: { merchantUuid: merchantId }
                }]
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found or access denied'
                });
            }

            // Delete associated images first
            await db.ProductImage.destroy({
                where: { productUuid: product.uuid }
            });

            // Delete the product
            await product.destroy();

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            logger.error(`Error deleting product: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to delete product'
            });
        }
    },

    async deleteProductImage(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { imageId } = req.params;

            const image = await db.ProductImage.findOne({
                where: { uuid: imageId },
                include: [{
                    model: db.Product,
                    include: [{
                        model: db.MerchantShop,
                        where: { merchantUuid: merchantId }
                    }]
                }]
            });

            if (!image) {
                return res.status(404).json({
                    success: false,
                    message: 'Image not found or access denied'
                });
            }

            // Delete the file using the upload controller
            const uploadController = require("../UploadController");
            await uploadController.deleteFile(`products/${image.imageUrl}`);

            // Delete the database record
            await image.destroy();

            res.json({
                success: true,
                message: 'Product image deleted successfully'
            });
        } catch (error) {
            logger.error(`Error deleting product image: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to delete product image'
            });
        }
    }
};

module.exports = ProductController;