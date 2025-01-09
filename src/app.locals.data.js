const db = require("./models");
const { MerchantShopCategory, MarketZones } = db.sequelize.models;
const AppLocalsData = { categories: [], zones: [] };

function fetchCategories() {
	return MerchantShopCategory.findAll({ raw: true }).then(function (
		categories
	) {
		console.log("Shop categories fetched >>" + categories.length);
		AppLocalsData.categories = categories;
	});
}

function fetchZones() {
	return MarketZones.findAll({ raw: true }).then(function (zones) {
		console.log("Zones fetched >>>" + zones.length);
		AppLocalsData.zones = zones;
	});
}

async function populateAppLocals(callback) {
	// fetchCategories();
	// fetchZones();
	await Promise.all([fetchCategories(), fetchZones()]).then((data) => {
		console.log("data Promise", data);
	});
	//console.log("AppLocalsData>>", AppLocalsData);
	if (callback) {
		callback(AppLocalsData);
	}
}

function getLocalsData() {
	return AppLocalsData;
}

module.exports = {
	populateAppLocals,
	getLocalsData,
};
