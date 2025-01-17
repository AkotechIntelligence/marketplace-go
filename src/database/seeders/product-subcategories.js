const { v4: uuidv4 } = require('uuid');

const productSubcategories = [
  // Electronics subcategories
  {
    uuid: uuidv4(),
    name: 'Smartphones',
    productCategoryUuid: null, // Will be set at runtime
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uuid: uuidv4(),
    name: 'Laptops',
    productCategoryUuid: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Fashion subcategories
  {
    uuid: uuidv4(),
    name: "Men's Clothing",
    productCategoryUuid: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    uuid: uuidv4(),
    name: "Women's Clothing", 
    productCategoryUuid: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = productSubcategories;