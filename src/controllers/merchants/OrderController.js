const db = require("../../models");
const logger = require("../../logger");

const OrderController = {
    async getMerchantOrders(req, res) {
        try {
            const merchantId = req.user.uuid;
            logger.info(`Fetching orders for merchant: ${merchantId}`);

            // Get all orders for merchant's shops
            const orders = await db.Order.findAll({
                include: [
                    {
                        model: db.OrderItem,
                        include: [
                            {
                                model: db.Product,
                                include: [{
                                    model: db.MerchantShop,
                                    where: { merchantUuid: merchantId },
                                    attributes: ['shopName']
                                }]
                            }
                        ]
                    },
                    {
                        model: db.User,
                        attributes: ['firstName', 'lastName', 'email']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/merchant/orders", {
                title: "Orders",
                layout: "layout/merchant-account",
                orders,
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant orders: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    }
};

module.exports = OrderController;