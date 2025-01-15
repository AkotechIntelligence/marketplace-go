const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger");
const fs = require('fs');
const path = require('path');

const ProductController = {
    async getProducts(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { shopUuid } = req.params;

            logger.info('Fetching products', { merchantId, shopUuid });

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
                    logger.warn('Shop not found or unauthorized access', { shopUuid, merchantId });
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
                    },
                    {
                        model: db.ProductSubcategory,
                        as: 'subcategory'
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            logger.info('Products fetched successfully', {
                merchantId,
                productCount: products.length
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
            logger.error('Error fetching products', { error: error.message, stack: error.stack });
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
                title: "Create Product111",
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
            logger.info('Starting product creation', {
                merchantId: req.user.uuid,
                shopId: req.body.merchantShopUuid,
                receivedData: req.body
            });

            // Validate shop ownership
            const shop = await db.MerchantShop.findOne({
                where: {
                    uuid: req.body.merchantShopUuid,
                    merchantUuid: req.user.uuid
                }
            });

            if (!shop) {
                logger.warn('Unauthorized shop access attempt', {
                    merchantId: req.user.uuid,
                    shopId: req.body.merchantShopUuid
                });
                return res.status(403).json({
                    success: false,
                    message: "You don't have permission to add products to this shop"
                });
            }

            // Generate UUID and create product
            const productUuid = uuidv4(); // Assign UUID to a variable
            const product = await db.Product.create({
                uuid: productUuid,
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                merchantShopUuid: req.body.merchantShopUuid,
                categoryUuid: req.body.categoryUuid,
                subCategoryUuid: req.body.subCategoryUuid,
                currencyCode: req.body.currencyCode || 'GHS',
                slug: `${req.body.name.toLowerCase().replace(/\s+/g, '-')}-${productUuid.slice(0, 8)}` // Generate slug
            });

            // Handle product options
            if (req.body.productOptions) {
                const options = JSON.parse(req.body.productOptions);
                await Promise.all(options.map(async (option) => {
                    let imageUrl = null;
                    if (option.imageUrl) {
                        // Extract base64 data
                        const base64Data = option.imageUrl.split(',')[1];
                        const fileName = `${uuidv4()}.png`; // Generate a unique filename
                        const filePath = path.join('public/uploads/products', fileName);

                        // Save the base64 image to the filesystem
                        fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
                        imageUrl = fileName; // Save the filename instead of base64
                    }
                    await db.ProductOption.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        merchantUuid: req.user.uuid,
                        shopUuid: req.body.merchantShopUuid,
                        optionName: option.optionName,
                        price: option.price,
                        imageUrl: imageUrl // Save the filename
                    });
                }));
            }

            // Handle product fields
            if (req.body.productFields) {
                const fields = JSON.parse(req.body.productFields);
                await Promise.all(fields.map(field =>
                    db.ProductField.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        fieldName: field.fieldLabel.toLowerCase().replace(/\s+/g, '_'),
                        fieldLabel: field.fieldLabel,
                        fieldType: field.fieldType
                    })
                ));
            }

            // Handle product images
            if (req.files && req.files.length > 0) {
                await Promise.all(req.files.map((file, index) =>
                    db.ProductImage.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        imageUrl: file.filename,
                        isDefault: index === 0
                    })
                ));
            }

            logger.info('Product created successfully', { productId: product.uuid });

            // Return success response
            res.status(201).json({
                success: true,
                message: "Product created successfully",
                productId: product.uuid
            });

        } catch (error) {
            logger.error('Error creating product', {
                error: error.message,
                stack: error.stack,
                merchantId: req.user?.uuid
            });

            // Return error response
            res.status(500).json({
                success: false,
                message: "Failed to create product "+error?.message,
                error: error.message
            });
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
            const { productUuid } = req.params;
            const merchantId = req.user.uuid;

            logger.info('Starting product update', { productUuid, merchantId });

            // Verify product ownership
            const product = await db.Product.findOne({
                where: { uuid: productUuid },
                include: [{
                    model: db.MerchantShop,
                    where: { merchantUuid: merchantId }
                }]
            });

            if (!product) {
                logger.warn('Product not found or unauthorized access', { productUuid, merchantId });
                return res.status(404).json({
                    success: false,
                    message: "Product not found or access denied"
                });
            }

            // Update product
            await product.update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                merchantShopUuid: req.body.merchantShopUuid,
                categoryUuid: req.body.categoryUuid,
                subCategoryUuid: req.body.subCategoryUuid,
                currencyCode: req.body.currencyCode
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

            // Update options if provided
            if (req.body.productOptions) {
                const options = JSON.parse(req.body.productOptions);
                // Delete existing options
                await db.ProductOption.destroy({
                    where: { productUuid: product.uuid }
                });
                // Create new options
                await Promise.all(options.map(async (option, index) => {
                    let imageUrl = null;
                    // Check if there are files for product option images
                    if (req.body.optionImages && req.body.optionImages[index]) {
                        imageUrl = req.body.optionImages[index]; // Assuming optionImages contains filenames
                    }
                    await db.ProductOption.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        merchantUuid: merchantId,
                        shopUuid: product.merchantShopUuid,
                        optionName: option.optionName,
                        price: option.price,
                        imageUrl: imageUrl // Save the filename
                    });
                }));
            }

            // Update fields if provided
            if (req.body.productFields) {
                const fields = JSON.parse(req.body.productFields);
                // Delete existing fields
                await db.ProductField.destroy({
                    where: { productUuid: product.uuid }
                });
                // Create new fields
                await Promise.all(fields.map(field =>
                    db.ProductField.create({
                        uuid: uuidv4(),
                        productUuid: product.uuid,
                        ...field
                    })
                ));
            }

            logger.info('Product updated successfully', { productUuid });

            res.json({
                success: true,
                message: "Product updated successfully"
            });

        } catch (error) {
            logger.error('Error updating product', {
                error: error.message,
                stack: error.stack,
                merchantId: req.user?.uuid
            });

            res.status(500).json({
                success: false,
                message: "Failed to update product",
                error: error.message
            });
        }
    },

    async deleteProduct(req, res) {
        try {
            const { productUuid } = req.params;
            const merchantId = req.user.uuid;

            logger.info('Attempting to delete product', { productUuid, merchantId });

            const product = await db.Product.findOne({
                where: { uuid: productUuid },
                include: [{
                    model: db.MerchantShop,
                    where: { merchantUuid: merchantId }
                }]
            });

            if (!product) {
                logger.warn('Product not found or unauthorized deletion attempt', { productUuid, merchantId });
                return res.status(404).json({
                    success: false,
                    message: "Product not found or access denied"
                });
            }

            // Delete associated images first
            await db.ProductImage.destroy({
                where: { productUuid: product.uuid }
            });

            // Delete associated options
            await db.ProductOption.destroy({
                where: { productUuid: product.uuid }
            });

            // Delete associated fields
            await db.ProductField.destroy({
                where: { productUuid: product.uuid }
            });

            // Delete the product
            await product.destroy();

            logger.info('Product deleted successfully', { productUuid });

            res.json({
                success: true,
                message: "Product deleted successfully"
            });

        } catch (error) {
            logger.error('Error deleting product', {
                error: error.message,
                stack: error.stack,
                merchantId: req.user?.uuid
            });

            res.status(500).json({
                success: false,
                message: "Failed to delete product",
                error: error.message
            });
        }
    },

    async deleteProductImage(req, res) {
        try {
            const { imageId } = req.params;
            const merchantId = req.user.uuid;

            logger.info('Attempting to delete product image', { imageId, merchantId });

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
                logger.warn('Image not found or unauthorized deletion attempt', { imageId, merchantId });
                return res.status(404).json({
                    success: false,
                    message: "Image not found or access denied"
                });
            }

            // Delete the file using the upload controller
            const uploadController = require("../UploadController");
            await uploadController.deleteFile(`products/${image.imageUrl}`);

            // Delete the database record
            await image.destroy();

            logger.info('Product image deleted successfully', { imageId });

            res.json({
                success: true,
                message: "Product image deleted successfully"
            });

        } catch (error) {
            logger.error('Error deleting product image', {
                error: error.message,
                stack: error.stack,
                merchantId: req.user?.uuid
            });

            res.status(500).json({
                success: false,
                message: "Failed to delete product image",
                error: error.message
            });
        }
    }
};

module.exports = ProductController;
