const uuidv4 = require("uuid").v4;
const MarketZones = require("./zones");
const MerchantShop = require("./merchantshop");

const MarketShopCategory = [
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,

		name: "Merchant",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Building Materials",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Home Services",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Cars",
		description: "",
	},

	//  Businness

	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Recruitment",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Video/Business Empowerment & Seminars/Summits",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Entrepreneurs Networking",
		description: "",
	},

	// Entertainment
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[4].zoneUuid,
		name: "Vidoes/Music",
		description: "",
	},

	// Chat Room

	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[2].zoneUuid,
		name: "Hangout/Networking",
		description: "",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[2].zoneUuid,
		name: "Services",
		description: "",
	},
];

module.exports = MarketShopCategory;
