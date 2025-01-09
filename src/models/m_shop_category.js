module.exports = (sequelize, DataTypes) => {
	const MerchantShopCategory = sequelize.define(
		"MerchantShopCategory",
		{
			uuid: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			// merchantShopUuid: DataTypes.STRING, use to be like this
			zoneUuid: DataTypes.STRING,
			name: DataTypes.STRING,
			description: DataTypes.STRING,
			icon: DataTypes.STRING,
		},
		{
			tableName: "MerchantShopCategory",
		}
	);

	return MerchantShopCategory;
};
