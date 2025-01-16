const db = require("../../models");
const logger = require("../../logger");

const SettingsController = {
    async getSettings(req, res) {
        try {
            const merchantId = req.user.uuid;
            const settings = await db.MerchantSettings.findOne({
                where: { merchantUuid: merchantId }
            });

            res.render("page/merchant/settings", {
                title: "Settings",
                layout: "layout/merchant-account",
                settings: settings || {},
                user: req.user
            });
        } catch (error) {
            logger.error(`Error fetching merchant settings: ${error.message}`, { error });
            req.flash('error', 'Failed to load settings');
            res.redirect('/merchant');
        }
    },

    async updateSettings(req, res) {
        try {
            const merchantId = req.user.uuid;
            const {
                bankName,
                accountNumber,
                accountName,
                swiftCode,
                mobileMoneyProvider,
                mobileNumber,
                settlementFrequency,
                minimumSettlementAmount,
                settlementMethod
            } = req.body;

            const [settings] = await db.MerchantSettings.upsert({
                merchantUuid: merchantId,
                bankName,
                accountNumber,
                accountName,
                swiftCode,
                mobileMoneyProvider,
                mobileNumber,
                settlementFrequency,
                minimumSettlementAmount: parseFloat(minimumSettlementAmount),
                settlementMethod,
                updatedAt: new Date()
            });

            logger.info(`Settings updated for merchant: ${merchantId}`);
            
            res.json({
                success: true,
                message: 'Settings updated successfully',
                settings
            });
        } catch (error) {
            logger.error(`Error updating merchant settings: ${error.message}`, { error });
            res.status(500).json({
                success: false,
                message: 'Failed to update settings'
            });
        }
    }
};

module.exports = SettingsController;