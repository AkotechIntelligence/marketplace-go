'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Update Order table
    await queryInterface.changeColumn('Order', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    await queryInterface.changeColumn('Order', 'userUuid', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uuid'
      }
    });

    await queryInterface.changeColumn('Order', 'merchantUuid', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Merchant',
        key: 'uuid'
      }
    });

    // Add currency code to Order
    await queryInterface.addColumn('Order', 'currencyCode', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'GHS'
    });

    // Update OrderItem table
    await queryInterface.changeColumn('OrderItem', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    });

    await queryInterface.changeColumn('OrderItem', 'orderUuid', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'uuid'
      }
    });

    await queryInterface.changeColumn('OrderItem', 'productUuid', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'uuid'
      }
    });

    // Add currency code to OrderItem
    await queryInterface.addColumn('OrderItem', 'currencyCode', {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: 'GHS'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove currency code from OrderItem
    await queryInterface.removeColumn('OrderItem', 'currencyCode');

    // Remove currency code from Order
    await queryInterface.removeColumn('Order', 'currencyCode');

    // Revert Order table
    await queryInterface.changeColumn('Order', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    await queryInterface.changeColumn('Order', 'userUuid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'uuid'
      }
    });

    await queryInterface.changeColumn('Order', 'merchantUuid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Merchant',
        key: 'uuid'
      }
    });

    // Revert OrderItem table
    await queryInterface.changeColumn('OrderItem', 'uuid', {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true
    });

    await queryInterface.changeColumn('OrderItem', 'orderUuid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'uuid'
      }
    });

    await queryInterface.changeColumn('OrderItem', 'productUuid', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'uuid'
      }
    });
  }
};