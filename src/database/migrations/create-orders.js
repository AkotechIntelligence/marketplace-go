'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'uuid'
        }
      },
      merchantUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Merchants',
          key: 'uuid'
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled'),
        defaultValue: 'pending'
      },
      total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      shippingAddress: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('orders');
  }
};