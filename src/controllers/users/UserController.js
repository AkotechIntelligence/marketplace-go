const db = require("../../models");
const logger = require("../../logger");

const UserController = {
    async getDashboard(req, res) {
        try {
            const userId = req.user.uuid;
            logger.info(`Fetching dashboard data for user: ${userId}`);

            // Get user's orders
            const orders = await db.Order.findAll({
                where: { userUuid: userId },
                limit: 5,
                order: [['createdAt', 'DESC']]
            });

            // Get user's wishlist
            const wishlist = await db.Wishlist.findAll({
                where: { userUuid: userId },
                include: [{ model: db.Product }],
                limit: 5
            });

            res.render("page/user/dashboard", {
                title: "User Dashboard",
                layout: "layout/user-account",
                orders,
                wishlist
            });
        } catch (error) {
            logger.error(`Error fetching user dashboard: ${error.message}`, { error });
            res.render("errors/500", {
                title: "Server Error",
                layout: "layout/blank-layout",
                error: error.message
            });
        }
    },

    // Add other user related methods here
};

module.exports = UserController;