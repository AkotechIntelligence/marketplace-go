module.exports = (sequelize, DataTypes) => {
	const ProductSubcategory = sequelize.define(
		"ProductSubcategory",
		{
			uuid: {
				type: DataTypes.STRING,

				primaryKey: true,

				allowNull: false,
			},
			//zoneUuid: DataTypes.STRING,
			productCategoryUuid: DataTypes.STRING,

			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "ProductSubcategory",
		}
	);

	return ProductSubcategory;
};
