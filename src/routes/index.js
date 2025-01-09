const express = require("express");
const router = express.Router();
const PageRouter = require("./page");
const ApiRouter = require("./api");
const AuthRouter = require("./auth");
const AdminRouter = require("./admin");

router.use("/", PageRouter);
router.use("/auth", AuthRouter);
router.use("/api", ApiRouter);
router.use("/admin", AdminRouter);

router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

module.exports = router;
