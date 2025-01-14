const { v4: uuidv4 } = require('uuid');

const productFieldTypes = [
    {
        uuid: uuidv4(),
        name: 'TextInput',
        description: 'Single line text input field',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uuid: uuidv4(),
        name: 'SingleSelect',
        description: 'Single option selection from dropdown',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uuid: uuidv4(),
        name: 'MultiSelect',
        description: 'Multiple option selection',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        uuid: uuidv4(),
        name: 'Number',
        description: 'Numeric input field',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

module.exports = productFieldTypes;