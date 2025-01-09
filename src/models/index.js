// models/index.js
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const configDB = require("./../database/config/database");
const db = {};
const env = process.env.NODE_ENV || "development";
const config = configDB[env];

let sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
		host: config.host,
		dialect: config.dialect,
		logging: true,
		define: config.define,
		pool: config.pool,
	}
);



const models = {};




sequelize.authenticate().then(() => {
	console.log("Connection has been established successfully.");
	loadModels(sequelize, Sequelize);
}).catch((err) => {
	console.error("Unable to connect to the database:", err);
	if (process.env.NODE_ENV === 'development') {
		console.log('Falling back to SQLite in-memory database...');
		sequelize = new Sequelize('sqlite::memory:', {
			logging: true
		});
		console.log('SQLite connection established successfully.');
		loadModels(sequelize, Sequelize);
	}
});

function loadModels(sequelize, Sequelize) {
	fs.readdirSync(__dirname)
		.filter((file) => file.indexOf(".") !== 0 && file !== "index.js")
		.forEach((file) => {
			const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
			db[model.name] = model;
		});

	Object.keys(db).forEach((modelName) => {
		if ("associate" in db[modelName]) {
			db[modelName].associate(db);
		}
	});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
	return db;
}


module.exports = db;
