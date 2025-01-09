module.exports = (sequelize, DataTypes) => {
	const ProductCategory = sequelize.define(
		"ProductCategory",
		{
			uuid: {
				type: DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			zoneUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			merchantShopCategoryUuid: DataTypes.STRING,
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "ProductCategory",
		}
	);
	return ProductCategory;
};
