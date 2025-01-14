const { Sequelize } = require("sequelize");
const db = require("../../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');
const logger = require("../../logger");


const MerchantController = {
    async getDashboard(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching dashboard data for merchant: ${merchantId}`);

            // Get merchant's shops with product counts
            const shops = await db.MerchantShop.findAll({
                where: { merchantUuid: merchantId },
                attributes: [
                    'uuid',
                    'shopName',
                    'description',
                    'imageUrl',
                    'createdAt'

                ],
                group: [
                    'MerchantShop.uuid',
                    'MerchantShop.shopName',
                    'MerchantShop.description',
                    'MerchantShop.imageUrl',
                    'MerchantShop.createdAt'
                ]
            });

            // Get recent orders
            const recentOrders = await db.Order.findAll({
                include: [{
                    model: db.OrderItem,
                    as: 'orderItems',
                    include: [{
                        model: db.Product,
                        as: 'product',
                        include: [{
                            model: db.MerchantShop,
                            where: { merchantUuid: merchantId }
                        }]
                    }]
                }],
                limit: 5,
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/dashboard", {
                title: "Dashboard",
                layout: "layout/merchant-account",
                shops,
                recentOrders,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error loading merchant dashboard: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    async getMerchantProfile(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching profile for merchant: ${merchantId}`);

            const merchant = await db.Merchant.findByPk(merchantId, {
                attributes: { exclude: ['password'] }
            });

            if (!merchant) {
                logger.warn(`Merchant not found: ${merchantId}`);
                return res.render("errors/404", {
                    title: "Not Found",
                    layout: "layout/blank-layout"
                });
            }

            res.render("page/merchant/profile", {
                title: "Profile",
                layout: "layout/merchant-account",
                merchant,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant profile: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    async createMerchant(req, res) {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                phoneNumber,
                dateOfBirth,
                description
            } = req.body;

            // Check if merchant already exists
            const existingMerchant = await db.Merchant.findOne({
                where: {
                    [Sequelize.Op.or]: [{ email }, { phoneNumber }]
                }
            });

            if (existingMerchant) {
                return res.status(400).json({
                    status: "error",
                    message: "Merchant with this email or phone number already exists"
                });
            }

            // Create merchant
            const merchant = await db.Merchant.create({
                uuid: uuidv4(),
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                password,
                phoneNumber,
                dateOfBirth,
                description,
                imageUrl: req.file ? req.file.filename : null
            });

            logger.info(`Merchant created successfully: ${merchant.uuid}`);
            return res.status(201).json({
                status: "success",
                message: "Merchant successfully created"
            });
        } catch (error) {
            logger.error(`Error creating merchant: ${error.message}`, { error });
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    },

    async editMerchant(req, res) {
        try {
            const merchantId = req.params.id;
            logger.info(`Updating merchant: ${merchantId}`);

            const merchant = await db.Merchant.findByPk(merchantId);
            if (!merchant) {
                return res.status(404).json({
                    status: "error",
                    message: "Merchant not found"
                });
            }

            // Update merchant data
            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                fullName: `${req.body.firstName} ${req.body.lastName}`,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                dateOfBirth: req.body.dateOfBirth,
                description: req.body.description
            };

            // Update password if provided
            if (req.body.password) {
                updateData.password = await bcrypt.hash(req.body.password, 10);
            }

            // Update image if provided
            if (req.file) {
                updateData.imageUrl = req.file.filename;
            }

            await merchant.update(updateData);

            logger.info(`Merchant updated successfully: ${merchantId}`);
            return res.status(200).json({
                status: "success",
                message: "Merchant successfully updated"
            });
        } catch (error) {
            logger.error(`Error updating merchant: ${error.message}`, { error });
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    },

    async deleteMerchantImage(req, res) {
        try {
            const merchantId = req.params.id;
            logger.info(`Deleting merchant image: ${merchantId}`);

            const merchant = await db.Merchant.findByPk(merchantId);
            if (!merchant) {
                return res.status(404).json({
                    message: "Merchant not found"
                });
            }

            if (merchant.imageUrl) {
                // Delete the file using the upload controller
                const uploadController = require("../UploadController");
                await uploadController.deleteFile(`merchants/${merchant.imageUrl}`);

                // Update merchant record
                merchant.imageUrl = null;
                await merchant.save();
            }

            return res.status(200).json({
                status: "success",
                message: "Merchant image deleted successfully"
            });
        } catch (error) {
            logger.error(`Error deleting merchant image: ${error.message}`, { error });
            return res.status(500).json({
                status: "error",
                message: "Failed to delete merchant image"
            });
        }
    },

    async deleteMerchantById(req, res) {
        try {
            const merchantId = req.params.id;
            logger.info(`Deleting merchant: ${merchantId}`);

            const merchant = await db.Merchant.findByPk(merchantId);
            if (!merchant) {
                return res.status(404).json({
                    status: "error",
                    message: "Merchant not found"
                });
            }

            // Delete associated shops
            await db.MerchantShop.destroy({
                where: { merchantUuid: merchantId }
            });

            // Delete merchant
            await merchant.destroy();

            logger.info(`Merchant deleted successfully: ${merchantId}`);
            return res.status(200).json({
                status: "success",
                message: "Merchant deleted successfully"
            });
        } catch (error) {
            logger.error(`Error deleting merchant: ${error.message}`, { error });
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
};

module.exports = MerchantController;
