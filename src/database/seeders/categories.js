const uuidv4 = require("uuid").v4;
const MarketZones = require("./zones");

const MarketShopCategory = [
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Electronics",
		description: "Electronics and gadgets",
		icon: "fas fa-laptop",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Fashion",
		description: "Clothing and accessories",
		icon: "fas fa-tshirt",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Home Services",
		description: "",
		icon: "fas fa-home",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[1].zoneUuid,
		name: "Cars",
		description: "",
		icon: "fas fa-car",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Recruitment",
		description: "",
		icon: "fas fa-users",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Video/Business Empowerment & Seminars/Summits",
		description: "",
		icon: "fas fa-video",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[3].zoneUuid,
		name: "Entrepreneurs Networking",
		description: "",
		icon: "fas fa-network-wired",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[4].zoneUuid,
		name: "Videos/Music",
		description: "",
		icon: "fas fa-music",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[2].zoneUuid,
		name: "Hangout/Networking",
		description: "",
		icon: "fas fa-users",
	},
	{
		uuid: uuidv4(),
		zoneUuid: MarketZones[2].zoneUuid,
		name: "Services",
		description: "",
		icon: "fas fa-concierge-bell",
	},
];

module.exports = MarketShopCategory;