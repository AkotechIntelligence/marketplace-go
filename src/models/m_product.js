module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		"Product",
		{
			uuid: {
				type: DataTypes.STRING,

				primaryKey: true,
				allowNull: false,
			},
			slug: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			// zoneUuid: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },
			// merchantShopCategoryUuid: {
			// 	type: DataTypes.STRING,
			// 	allowNull: false,
			// },

			merchantShopUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			categoryUuid: {
				// this is productCategory
				type: DataTypes.STRING,
				allowNull: false,
			},
			subCategoryUuid: {
				// this is subproductCategory
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "Product",
		}
	);

	return Product;
};
