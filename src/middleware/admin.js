const isAdmin = (req, res, next) => {
	if (req.isAuthenticated() && req.user && req.user.isAdmin) {
		console.log("req user");

		next();
	} else {
		res.status(403).send("Forbidden");
	}
};

module.exports = isAdmin;
