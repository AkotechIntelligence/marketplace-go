'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderItem', 'currencyCode', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'USD',
      references: {
        model: 'Currency',
        key: 'code'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderItem', 'currencyCode');
  }
};