'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add index for createdAt
    await queryInterface.addIndex('Order', ['createdAt'], {
      name: 'order_created_at_idx'
    });

    // Add index for status
    await queryInterface.addIndex('Order', ['status'], {
      name: 'order_status_idx'
    });

    // Add compound index for merchant and date
    await queryInterface.addIndex('Order', ['merchantUuid', 'createdAt'], {
      name: 'order_merchant_date_idx'
    });

    // Add compound index for shop and date
    await queryInterface.addIndex('Order', ['merchantShopUuid', 'createdAt'], {
      name: 'order_shop_date_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Order', 'order_created_at_idx');
    await queryInterface.removeIndex('Order', 'order_status_idx');
    await queryInterface.removeIndex('Order', 'order_merchant_date_idx');
    await queryInterface.removeIndex('Order', 'order_shop_date_idx');
  }
};