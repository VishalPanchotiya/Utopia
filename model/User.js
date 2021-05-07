const mongoose = require('mongoose');

const validator = require('validator');
const bcrypt = require('bcryptjs');

UsersSchema = new mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: ' Entered Invalid Email'
		}
	},
	country_code: {
		type: String
	},
	phone: {
		type: String
	},
	password: {
		type: String
	}
});
module.exports = mongoose.model('Users', UsersSchema);