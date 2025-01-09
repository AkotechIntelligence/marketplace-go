// Rotas GET
const getHomePage = (req, res) => {
	//res.render("page/home", { session: false });
	console.log("req user", req);
	res.render("page/account", {
		title: "Home",
		layout: "layout/account",
	});
};

// export default {
// 	getHomePage,
// };

module.exports = { getHomePage };
