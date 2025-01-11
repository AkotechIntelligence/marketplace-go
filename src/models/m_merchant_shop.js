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
			merchantShopCategoryUuid: DataTypes.STRING,
			merchantUuid: DataTypes.STRING,
			imageUrl: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			tableName: "MerchantShop",
		}
	);

	MerchantShop.associate = function(models) {
		MerchantShop.hasMany(models.Product, {
			foreignKey: 'merchantShopUuid',
			sourceKey: 'uuid'
		});
	};

	return MerchantShop;
};