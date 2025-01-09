module.exports = (sequelize, DataTypes) => {
	const ProductFields = sequelize.define(
		"ProductFields",
		{
			fieldName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			fieldValue: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			productUuid: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			fieldLabel: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "ProductFields",
		}
	);

	return ProductFields;
};
