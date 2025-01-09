module.exports = {
	development: {
		username: process.env.DBUSER ||  "postgres",
		password: process.env.DBPASS ||   "pass@1234",
		database:  process.env.DBNAME ||   "database_development",
		host:  process.env.DBHOST || "127.0.0.1",
		dialect: "postgres",
		operatorsAliases: 0,
		define: {
			timestamp: true,
			underscored: true,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
	test: {
		username: "",
		password: "",
		database: "",
		host: "",
		dialect: "",
	},
	production: {
		username: process.env.DBUSER ||  "postgres",
		password: process.env.DBPASS ||   "pass@1234",
		database:  process.env.DBNAME ||   "database_development",
		host:  process.env.DBHOST || "127.0.0.1",
		dialect: "postgres",
		operatorsAliases: 0,
		define: {
			timestamp: true,
			underscored: true,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 1000
		}
	},
};
