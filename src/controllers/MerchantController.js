const { Sequelize } = require("sequelize");
const db = require("../models");

const { Merchant } = db.sequelize.models;
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");
async function updateUserPasswor(password) {
	const saltHash = await crypto.randomBytes(32).toString();
	const hashPassword = await crypto
		.pbkdf2Sync(password, saltHash, 10000, 64, "sha512")
		.toString("hex");
	user.password = hashPassword;
	user.password_key = saltHash;
	return { password, password };
}

const MerchantController = {
	async createMerchant(req, res) {
		try {
			const {
				firstName,
				lastName,
				fullName,
				dateOfBirth,
				email,
				password,
				phoneNumber,
				idCardNumber,
			} = req.body;
			console.log("req body", req.body);

			const user = await Merchant.findOne({
				where: {
					[Sequelize.Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
				},
			});

			if (user) {
				return res.status(419).json({
					status: "failed",
					message: "Merchant already exist",
				});
			}

			await Merchant.create({
				uuid: uuidv4(),
				firstName,
				lastName,
				fullName: firstName + " " + lastName,
				dateOfBirth,
				email,
				password,
				phoneNumber,
				idCardNumber,
				imageUrl: req.file ? req.file.filename : null,
			});

			res.status(201).json({
				message: "Merchant  successfully created",
				status: "success",
			});
		} catch (error) {
			console.log("error", error);
			return res.status(500).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},

	async deleteMerchantImage(req, res) {
		try {
			console.log("req.byd", req.body);

			const findMerchant = await Merchant.findOne({
				where: { uuid: req.params.id },
			});
			if (!findMerchant) {
				return res.status(404).json({
					message: "Merchant Shop not found",
				});
			}

			const imageUrl = findMerchant.imageUrl;

			if (imageUrl) {
				// Construct the file path
				const filePath = path.join(
					__dirname,
					"../../public/uploads",
					path.basename(imageUrl)
				);

				// Delete the file
				fs.unlink(filePath, async (err) => {
					if (err) {
						console.log("err", err);
						return res
							.status(500)
							.json({ error: "Failed to delete the image file" });
					}

					// Update the imageUrl column to null
					findMerchant.imageUrl = null;
					findMerchant.save();
					return res.status(200).json({
						message: "Merchant photo deleted successfully",
						status: "success",
					});
				});
			}
		} catch (error) {
			console.log("error", error);
			return res.status(201).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},

	async editMerchant(req, res) {
		try {
			console.log("req.byd", req.body);

			const findMerchant = await Merchant.findOne({
				where: { uuid: req.params.id },
			});
			if (!findMerchant) {
				return res.status(404).json({
					message: "Merchant does not exist",
				});
			}

			if (req.body.password) {
				const query = `
				UPDATE public."Merchant"
				SET
				first_name = :firstName,
				last_name = :lastName,
				full_name=:fullName,
				date_of_birth=:dateOfBirth,
				email=:email,
				password=:password,
				password_key=:password_key,
				phone_number=:phoneNumber,
				id_card_number=:idCardNumber,
				image_url=:image_url


				WHERE
					uuid = :uuid
				`;

				const { password, password_key } = await updateUserPasswor(
					req.body.password
				);
				const [rowsUpdated, _] = await db.sequelize.query(query, {
					replacements: {
						uuid: req.params.id,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						fullName: req.body.firstName + " " + req.body.lastName,

						dateOfBirth: req.body.dateOfBirth,
						email: req.body.email,
						password: password,
						password_key: password_key,
						phoneNumber: req.body.phoneNumber,
						idCardNumber: req.body.idCardNumber,
						image_url: req.file
							? req.file.filename
							: findMerchant.dataValues.imageUrl,
					},
				});
			} else {
				const query = `
				UPDATE public."Merchant"
				SET
				first_name =:firstName,
				last_name =:lastName,
				full_name=:fullName,
				date_of_birth=:dateOfBirth,
				email=:email,
				phone_number=:phoneNumber,
				id_card_number=:idCardNumber,
				image_url=:image_url


				WHERE
					uuid = :uuid
				`;

				const [rowsUpdated, _] = await db.sequelize.query(query, {
					replacements: {
						uuid: req.params.id,
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						fullName: req.body.firstName + " " + req.body.lastName,
						dateOfBirth: req.body.dateOfBirth,
						email: req.body.email,
						phoneNumber: req.body.phoneNumber,
						idCardNumber: req.body.idCardNumber,
						image_url: req.file
							? req.file.filename
							: findMerchant.dataValues.imageUrl,
					},
				});
			}

			return res.status(201).json({
				message: "Merchant  successfully updated",
				status: "success",
			});
		} catch (error) {
			console.log("error", error);
			return res.status(400).json({
				message: "Error whilst saving data",
				status: "failed",
			});
		}
	},

	async deleteMerchantById(req, res) {
		const idParamSchema = z.object({
			id: z.string().min(4),
		});

		const validateParams = idParamSchema.safeParse(req.params);

		if (!validateParams.success) {
			return res.status(400).json({
				error: "Invalid data",
				status: "failed",
				message: validateParams.error.erros,
			});
		}

		try {
			// Check if category already exists by name
			console.log("paramsxx", req.params.id);
			const existingShop = await Merchant.findOne({
				where: { uuid: req.params.id },
			});

			if (!existingShop) {
				return res
					.status(400)
					.json({ error: "Merchant shop with id provided does not exist" });
			}

			await existingShop.destroy();

			return res.status(200).json({
				message: "Merchant deleted successfully",
				status: "success",
			});
		} catch (error) {
			console.log("error>>", error);
			res.status(400).json({
				status: "error",
				message: error.message,
			});
		}
	},
};

module.exports = MerchantController;

// export default MerchantController;
