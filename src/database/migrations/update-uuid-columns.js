'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update User table
    await queryInterface.changeColumn('User', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update Merchant table
    await queryInterface.changeColumn('Merchant', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update MerchantShop table
    await queryInterface.changeColumn('MerchantShop', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update MerchantShopCategory table
    await queryInterface.changeColumn('MerchantShopCategory', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update Product table
    await queryInterface.changeColumn('Product', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update ProductCategory table
    await queryInterface.changeColumn('ProductCategory', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update ProductSubcategory table
    await queryInterface.changeColumn('ProductSubcategory', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update ProductImage table
    await queryInterface.changeColumn('ProductImage', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update Order table
    await queryInterface.changeColumn('Order', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update OrderItem table
    await queryInterface.changeColumn('OrderItem', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    // Update Currency table
    await queryInterface.changeColumn('Currency', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert User table
    await queryInterface.changeColumn('User', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert Merchant table
    await queryInterface.changeColumn('Merchant', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert MerchantShop table
    await queryInterface.changeColumn('MerchantShop', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert MerchantShopCategory table
    await queryInterface.changeColumn('MerchantShopCategory', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert Product table
    await queryInterface.changeColumn('Product', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert ProductCategory table
    await queryInterface.changeColumn('ProductCategory', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert ProductSubcategory table
    await queryInterface.changeColumn('ProductSubcategory', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert ProductImage table
    await queryInterface.changeColumn('ProductImage', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert Order table
    await queryInterface.changeColumn('Order', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert OrderItem table
    await queryInterface.changeColumn('OrderItem', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    // Revert Currency table
    await queryInterface.changeColumn('Currency', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });
  }
};