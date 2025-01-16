const db = require("../../models");
const logger = require("../../logger");

const OrderController = {
    async getMerchantOrders(req, res) {
        try {
            const merchantId = req.user.uuid;
            const { shopUuid } = req.params;
            
            let where = { merchantUuid: merchantId };
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
                    return res.redirect('/merchant/orders');
                }

                where = {
                    ...where,
                    merchantShopUuid: shopUuid
                };
            }

            const orders = await db.Order.findAll({
                where,
                include: [
                    {
                        model: db.OrderItem,
                        as: 'orderItems',
                        include: [{
                            model: db.Product,
                            as: 'product',
                            attributes: ['name', 'price']
                        }]
                    },
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'email', 'fullName']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/orders", {
                title: "Orders",
                layout: "layout/merchant-account",
                orders,
                shop,
                shopUuid,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching orders: ${error.message}`, { error });
            req.flash('error', 'Failed to load orders');
            res.redirect('/merchant');
        }
    },

    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const merchantId = req.user.uuid;

            const order = await db.Order.findOne({
                where: { 
                    uuid: orderId,
                    merchantUuid: merchantId
                }
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (!['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }

            await order.update({ status });

            res.json({
                success: true,
                message: 'Order status updated successfully'
            });
        } catch (error) {
            logger.error(`Error updating order status: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to update order status'
            });
        }
    },

    async getOrderDetails(req, res) {
        try {
            const { orderId } = req.params;
            const merchantId = req.user.uuid;

            const order = await db.Order.findOne({
                where: { 
                    uuid: orderId,
                    merchantUuid: merchantId
                },
                include: [
                    {
                        model: db.OrderItem,
                        as: 'orderItems',
                        include: [{
                            model: db.Product,
                            as: 'product',
                            attributes: ['name', 'price']
                        }]
                    },
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'email', 'fullName']
                    }
                ]
            });

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            res.json({
                success: true,
                order
            });
        } catch (error) {
            logger.error(`Error fetching order details: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to load order details'
            });
        }
    }
};

module.exports = OrderController;