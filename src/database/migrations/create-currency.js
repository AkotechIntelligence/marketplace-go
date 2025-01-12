'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Currency', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      code: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dollarExchangeRate: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0000
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Currency');
  }
};