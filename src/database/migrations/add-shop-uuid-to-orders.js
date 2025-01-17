'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Order', 'merchantShopUuid', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'MerchantShop',
        key: 'uuid'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Create index for better query performance
    await queryInterface.addIndex('Order', ['merchantShopUuid'], {
      name: 'order_merchant_shop_uuid_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Order', 'order_merchant_shop_uuid_idx');
    await queryInterface.removeColumn('Order', 'merchantShopUuid');
  }
};