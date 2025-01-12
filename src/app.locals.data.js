const db = require("./models");
const AppLocalsData = { categories: [], zones: [] };

function fetchCategories() {
	return db.MerchantShopCategory.findAll({ raw: true }).then(function (
		categories
	) {
		console.log("Shop categories fetched >>" + categories.length);
		AppLocalsData.categories = categories;
	});
}

function fetchZones() {
	return db.MarketZone.findAll({ raw: true }).then(function (zones) {
		console.log("Zones fetched >>>" + zones.length);
		AppLocalsData.zones = zones;
	});
}

async function populateAppLocals(callback) {
	// fetchCategories();
	// fetchZones();
  setTimeout(async function () {
    	await Promise.all([fetchCategories(), fetchZones()]).then((data) => {
	   	console.log("data Promise", data);
	});
  },(10*1000))

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
