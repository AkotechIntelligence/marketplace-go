module.exports = (sequelize, DataTypes) => {
	const MerchantShop = sequelize.define(
		"MerchantShop",
		{
			 
			uuid: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			shopName: DataTypes.STRING,
			description: DataTypes.STRING,
			zoneUuid: DataTypes.STRING,
			merchantShopCategoryUuid: DataTypes.STRING, /// added newly
			merchantUuid: DataTypes.STRING,
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			//shopCategoryUuid: DataTypes.STRING,
		},
		{
			tableName: "MerchantShop",
		}
	);

	return MerchantShop;
};
