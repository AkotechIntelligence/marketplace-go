// MarketZones.js

module.exports = (sequelize, DataTypes) => {
	const MarketZones = sequelize.define(
		"MarketZones",
		{
			uuid: DataTypes.STRING,
			zoneUuid: DataTypes.STRING,
			name: DataTypes.STRING,
			description: DataTypes.STRING,
		},
		{
			tableName: "MarketZones",
		}
	);

	return MarketZones;
};
