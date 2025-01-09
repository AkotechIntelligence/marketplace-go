module.exports = (sequelize, DataTypes) => {
    const ProductFieldTypes = sequelize.define(
        "ProductFieldTypes",
        {
            name: DataTypes.STRING
            // Add other necessary fields
        },
        {
            tableName: "ProductFieldTypes"
        }
    );

    return ProductFieldTypes;
};
