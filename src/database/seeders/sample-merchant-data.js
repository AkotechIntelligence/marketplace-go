const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require("../../models");
const logger = require("../../logger");

// Sample data definition
const sampleData = {
    merchant: {
        uuid: uuidv4(),
        firstName: "John",
        lastName: "Doe", 
        fullName: "John Doe",
        email: "sample.merchant@example.com",
        password: bcrypt.hashSync("password123", 10),
        phoneNumber: "0123456789",
        dateOfBirth: "1990-01-01",
        type: "merchant",
        description: "Experienced merchant selling electronics and fashion items"
    },
    shops: [
        {
            uuid: uuidv4(),
            shopName: "Tech Haven",
            description: "Your one-stop shop for electronics",
            imageUrl: null
        },
        {
            uuid: uuidv4(),
            shopName: "Fashion Forward", 
            description: "Latest trends in fashion",
            imageUrl: null
        }
    ],
    products: [
        {
            uuid: uuidv4(),
            name: "Wireless Earbuds",
            description: "High-quality wireless earbuds with noise cancellation",
            price: 99.99,
            quantity: 50,
            currencyCode: "GHS",
            images: [
                {
                    uuid: uuidv4(),
                    imageUrl: "default-product.png",
                    default: true
                }
            ],
            options: [
                {
                    uuid: uuidv4(),
                    optionName: "Black",
                    price: 99.99
                },
                {
                    uuid: uuidv4(),
                    optionName: "White",
                    price: 99.99
                }
            ],
            fields: [
                {
                    uuid: uuidv4(),
                    fieldName: "color",
                    fieldLabel: "Color",
                    fieldType: "SingleSelect"
                },
                {
                    uuid: uuidv4(),
                    fieldName: "warranty",
                    fieldLabel: "Warranty Period",
                    fieldType: "SingleSelect"
                }
            ]
        },
        {
            uuid: uuidv4(),
            name: "Gaming Laptop",
            description: "Powerful gaming laptop with RTX graphics",
            price: 1499.99,
            quantity: 10,
            currencyCode: "GHS",
            images: [
                {
                    uuid: uuidv4(),
                    imageUrl: "default-product.png",
                    default: true
                }
            ]
        }
    ]
};

// Helper function to wait for categories
const waitForCategories = async () => {
    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
        const categories = await db.ProductCategory.findAll();
        if (categories && categories.length >= 2) {
            logger.info("Found required categories");
            return categories;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error("Required categories not found after waiting");
};

// Helper function to wait for subcategories
const waitForSubcategories = async () => {
    let retries = 0;
    const maxRetries = 5;
    
    while (retries < maxRetries) {
        const subcategories = await db.ProductSubcategory.findAll();
        if (subcategories && subcategories.length >= 4) {
            logger.info("Found required subcategories");
            return subcategories;
        }
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error("Required subcategories not found after waiting");
};

const seedSampleData = async () => {
    try {
        // Check if merchant already exists
        const existingMerchant = await db.Merchant.findOne({
            where: { email: sampleData.merchant.email }
        });

        if (existingMerchant) {
            logger.info("Sample merchant already exists");
            return;
        }

        // Create merchant
        const merchant = await db.Merchant.create(sampleData.merchant);
        logger.info("Created sample merchant");

        // Get required data
        const [zones, categories] = await Promise.all([
            db.MarketZone.findAll(),
            db.MerchantShopCategory.findAll()
        ]);

        if (!zones.length || !categories.length) {
            throw new Error("Required zones and categories must exist");
        }

        // Create shops
        const shops = await Promise.all(sampleData.shops.map(async (shop, index) => {
            const shopData = {
                ...shop,
                merchantUuid: merchant.uuid,
                zoneUuid: zones[0].zoneUuid,
                merchantShopCategoryUuid: categories[index].uuid
            };
            return db.MerchantShop.create(shopData);
        }));
        logger.info("Created sample shops");

        // Wait for categories and subcategories
        const [productCategories, productSubcategories] = await Promise.all([
            waitForCategories(),
            waitForSubcategories()
        ]);

        // Create products with delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        for (const product of sampleData.products) {
            const shopIndex = product.name.toLowerCase().includes('tech') ? 0 : 1;
            const categoryIndex = shopIndex;
            
            const productData = {
                ...product,
                merchantShopUuid: shops[shopIndex].uuid,
                categoryUuid: productCategories[categoryIndex].uuid,
                subCategoryUuid: productSubcategories[categoryIndex * 2].uuid
            };

            // Create product
            const createdProduct = await db.Product.create(productData);

            // Create product images
            if (product.images) {
                await Promise.all(product.images.map(image => 
                    db.ProductImage.create({
                        ...image,
                        productUuid: createdProduct.uuid
                    })
                ));
            }

            // Create product options
            if (product.options) {
                await Promise.all(product.options.map(option =>
                    db.ProductOption.create({
                        ...option,
                        uuid: uuidv4(),
                        productUuid: createdProduct.uuid,
                        merchantUuid: merchant.uuid,
                        shopUuid: shops[shopIndex].uuid
                    })
                ));
            }

            // Create product fields
            if (product.fields) {
                await Promise.all(product.fields.map(field =>
                    db.ProductField.create({
                        ...field,
                        productUuid: createdProduct.uuid
                    })
                ));
            }
        }

        logger.info("Sample data seeding completed successfully");
    } catch (error) {
        logger.error("Error seeding sample data:", error);
        throw error;
    }
};

module.exports = {
    sampleData,
    seedSampleData
};
