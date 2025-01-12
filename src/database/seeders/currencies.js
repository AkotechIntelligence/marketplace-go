const { v4: uuidv4 } = require('uuid');

const currencies = [
  {
    uuid: uuidv4(),
    code: 'USD',
    country: 'United States',
    dollarExchangeRate: 1.0000,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uuid: uuidv4(),
    code: 'GHS',
    country: 'Ghana',
    dollarExchangeRate: 15.15, // Example rate, should be updated to current rate
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = currencies;