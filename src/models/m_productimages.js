module.exports = (sequelize, DataTypes) => {
	const ProductImages = sequelize.define("ProductImages", {
		uuid: {
			type: DataTypes.STRING,

			primaryKey: true,
			allowNull: false,
		},
		productUuid: DataTypes.STRING,
		imageUrl: DataTypes.STRING,
	});
	return ProductImages;
};
