const path = require("path");
const rootPath = path.normalize(__dirname + "/..");
const env = process.env.NODE_ENV || "development";

const config = {
  development: {
    root: rootPath,
    app: {
      name: "MarketPlace-App",
      host : "localhost"
    },
    jwt_secret: process.env.JWT_SECRET || "bjdb!@#$#fdfssdy328",
    session_secret: process.env.SESSION_SECRET || "duns3030!#$Aw",
	},
  production: {
    root: rootPath,
    app: {
      name: "MarketPlace-App",
      host : "marketplaceapp.cachetechs.com"
    },
    jwt_secret: process.env.JWT_SECRET || "bjdb!@#$#fdfssdy328",
    session_secret: process.env.SESSION_SECRET || "duns3030!#$Aw",
   },
};

module.exports = config[env];
