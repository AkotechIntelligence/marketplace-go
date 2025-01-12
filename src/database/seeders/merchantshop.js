const { v4: uuidv4 } = require("uuid");

// We'll get the actual merchant UUID at runtime instead of hardcoding it
const MerchantShop = [
	{
		uuid: uuidv4(),
		shopName: "Valtrine Shop",
		description: "First shop in the marketplace",
		// These will be populated at runtime
		zoneUuid: null,
		merchantUuid: null,
		merchantShopCategoryUuid: null
	},
];

module.exports = MerchantShop;