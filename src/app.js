const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const initializePassport = require("./config/passport");
const MemoryStore = require("memorystore")(session);
require("express-async-errors"); // Handle Async errors
const config = require("./config/config");
const routes = require("./routes");
const appLocalsData = require("./app.locals.data");
const app = express();
const db = require("./models");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

initializePassport(passport);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

//passport config
app.use(
	session({
		secret: config.jwt_secret,
		resave: false,
		saveUninitialized: false,
		store: new SequelizeStore({
			db: db.sequelize,
			tableName: "sessions", // Name of the table to store sessions
		}),
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.user = req.user;

	res.locals.activePageClass = (route) => {
		if (req.path.indexOf(route.toLowerCase()) > -1) {
			return "activeLink";
		}
		return "";
	};
	populateLocals(res);
	next();
});
function populateLocals(res) {
	const locals = appLocalsData.getLocalsData();
	// console.log("locals>>", locals);
	assignLocals(res, locals);
}

setTimeout(function () {
	console.log("Populating app locals >>>");
	appLocalsData.populateAppLocals(function (appLocals) {
		console.log("App locals Populated >>", appLocals);
	});
}, 1000);

function assignLocals(res, appLocals) {
	res.locals.categories = appLocals.categories;
	res.locals.zones = appLocals.zones;
	res.locals.user = res.locals.user;
}
// Configure Multer for file uploads
app.use("/", routes);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	if (/\/api/.test(req.path)) return next(createError(404));
	res.render("errors/404", { title: "404", layout: "blank-layout" });
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	console.log(err.message);
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};
	// render the error page
	res.status(err.status || 500);
	console.log(err);
	console.log(err);
	if (/\/api/.test(req.path)) {
		return err.status
			? res.json(err)
			: res.json({
					status_code: "500",
					message: "Something went wrong",
					reason: "An Internal server erorr occurred",
			  });
	}
	res.render(`errors/${err.status || 500}`, {
		title: err.status || 500,
		error: err,
		layout: "layout/blank-layout",
	});
});

module.exports = app;
