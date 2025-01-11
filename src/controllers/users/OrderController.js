const db = require("../../models");
const logger = require("../../logger");

const OrderController = {
    async getUserOrders(req, res) {
        try {
            const userId = req.user.uuid;
            logger.info(`Fetching orders for user: ${userId}`);

            const orders = await db.Order.findAll({
                where: { userUuid: userId },
                include: [
                    { model: db.Product },
                    { model: db.MerchantShop }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render("page/user/orders", {
                title: "My Orders",
                layout: "layout/user-account",
                orders
            });
        } catch (error) {
            logger.error(`Error fetching user orders: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    // Add other order related methods here
};

module.exports = OrderController;