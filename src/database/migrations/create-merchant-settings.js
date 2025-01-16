'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MerchantSettings', {
      uuid: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      merchantUuid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Merchant',
          key: 'uuid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accountName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      swiftCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobileMoneyProvider: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobileNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      settlementFrequency: {
        type: Sequelize.ENUM('daily', 'weekly', 'biweekly', 'monthly'),
        defaultValue: 'weekly'
      },
      minimumSettlementAmount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 100.00
      },
      settlementMethod: {
        type: Sequelize.ENUM('bank', 'mobile'),
        defaultValue: 'bank'
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
    await queryInterface.dropTable('MerchantSettings');
  }
};