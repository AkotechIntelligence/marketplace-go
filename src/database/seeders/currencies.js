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
    dollarExchangeRate: 12.5000, // Current approximate rate
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = currencies;