const db = require("../models");
const { ProductSubSubcategory } = db.sequelize.models;
const ProductSubSubCategoryController = {
	async createSubSubCategory(req, res) {
		const { name, subcategoryUuid } = req.body;

		const findSubSubcategory = await ProductSubSubcategory.findOne({
			where: { name, subcategoryUuid },
		});

		if (findSubSubcategory) {
			return res.status(403).json({
				message: "Sub subcategory already exist",
			});
		}
		const productCategory = await ProductSubSubcategory.create({
			name,
			subcategoryUuid,
		});

		res.json({
			message: "done",
			data: productCategory,
		});
		// res.render("page/home", { session: false });
	},
};

module.exports = ProductSubSubCategoryController;
