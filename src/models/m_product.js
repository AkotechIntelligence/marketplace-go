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
			merchantShopUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			categoryUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			subCategoryUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "Product",
		}
	);

	Product.associate = function(models) {
		Product.belongsTo(models.MerchantShop, {
			foreignKey: 'merchantShopUuid',
			targetKey: 'uuid'
		});
	};

	return Product;
};