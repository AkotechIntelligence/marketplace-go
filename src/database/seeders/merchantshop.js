const uuidv4 = require("uuid").v4;

const Merchant = require("./merchant");
const Zone = require("./zones");
const MarketShopCategoryData = require("./categories");

const MerchantShop = [
	{
		uuid: uuidv4(),
		zoneUuid: Zone[0].zoneUuid,
		shopName: "Valtrine Shop",
		merchantUuid: Merchant[0].uuid,
		merchantShopCategoryUuid: MarketShopCategoryData[0].uuid,
	},
];

module.exports = MerchantShop;
