const { v4: uuidv4 } = require('uuid');

const productCategories = [
  {
    uuid: uuidv4(),
    name: 'Electronics',
    zoneUuid: null, // Will be set at runtime
    merchantShopCategoryUuid: null, // Will be set at runtime
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uuid: uuidv4(),
    name: 'Fashion',
    zoneUuid: null,
    merchantShopCategoryUuid: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = productCategories;