const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

UsersSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} Entered Invalid Email'
		}

	},
	phone: {

		type: String
	},
	country_code: {
		type: String
	},
	country: {
		type: String
	},
	state: {
		type: String,
		default: null
	},
	city: {
		type: String,
		default: null
	},
	dob: {
		type: String,
		default: null
	},

	isVerified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: true
	},

	OTP: {
		type: String,
		expire_at: { type: Date, default: Date.now, expires: 20 }
	},

	ref_code: {

		type: String,

	},
	ref_from: {

		type: String,

	},
	dataURL: {

		type: String,

	},
	qr_secret: {

		type: String,

	},
	qr_status: {

		type: String,

	},
	contract_address: {

		type: String
	},

	profile_image: {

		type: String

	},
	created_at: {
		type: String,
		default: new Date()
	},

	created_by: {

		type: Number,
		default: 0
	},

	updated_at: {

		type: String,
		default: null
	},

	updated_by: {

		type: String,
		default: 0
	},

	status: {

		type: String,
		enum: ['active', 'inactive'],
		default: 'active'

	},
	user_type: {
		type: String,
		enum: ['user', 'manager'],
		default: 'user'
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}

	}]
});

let Users = mongoose.model('Users', UsersSchema);

var Userwalletschema = mongoose.Schema({

	user_id: {
		type: String
	},
	wallet_address: {
		type: String
	},
	passphrase: {
		type: String
	},
	created_at: {
		type: String
	},
	deleted_at: {
		type: String,
		default: null
	},
	deleted_by: {

		type: String,
		default: null
	},

	updated_at: {

		type: String,
		default: null
	},
	status: {

		type: String,
		enum: ['active', 'inactive'],
		default: 'active'

	},
	deleted: {

		type: String,
		enum: ['0', '1'],
		default: '0'
	},
});

var Userwallet = mongoose.model('User_wallet', Userwalletschema);

const forgetPasswordTokenSchema = new mongoose.Schema({
	OTP: {
		type: String,
		required: true,
	},
	resend: {
		type: Boolean
	},
	_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
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
	created_at: {
		type: String,
		default: Date.now,
	},
	expire_at: { type: Date, default: Date.now, expires: 300 }
})
let forgetPasswordTokens = mongoose.model('forgetPasswordTokens', forgetPasswordTokenSchema);


const activationTokenSchema = new mongoose.Schema({
	_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
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
	created_at: {
		type: String,
		default: Date.now,
	},
	expire_at: { type: Date, default: Date.now, expires: 1800 }
})
let activationTokens = mongoose.model('activationTokens', activationTokenSchema);

const refferaltokenSchema = new mongoose.Schema({
	code: {
		type: String,
		required: true,
	},
	resend: {
		type: Boolean
	},
	_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
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
	created_at: {
		type: String,
		default: Date.now,
	},
	expire_at: { type: Date, default: Date.now, expires: 300 }
})
refferalToken = mongoose.model('refferalTokens', refferaltokenSchema);


var tokenTransactionSchema = new mongoose.Schema({

	Tx_hash: {
		type: String
	},
	Amount: {
		type: Number
	},
	From: {
		type: String
	},
	To: {
		type: String
	},
	status: {
		type: String
	},
	user_status: {
		type: String,
		enum: ['Active', 'Inactive'],
		default: 'Active'
	},
	created_at: {
		type: Date
	},

	created_by: {

		type: Number,
		default: 0
	},

	deleted_at: {
		type: Date,
		default: null
	},

	deleted_by: {

		type: String,
		default: null
	},

	updated_at: {

		type: Date,
		default: null
	},

	updated_by: {

		type: String,
		default: 0
	},

	deleted: {

		type: String,
		enum: ['0', '1'],
		default: '0'
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {

			type: String,
			required: true
		}
	}]
});

tokenTansactionInfo = mongoose.model('tokenTransactionSchema', tokenTransactionSchema);

var RefCodeschema = mongoose.Schema({
	my_ref_code: {
		type: String
	},
	reg_ref_code: {
		type: String
	},
	status: {
		type: String,
		default: "Not used"
	},
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User_registration'
	}
})

var RefCode = mongoose.model('RefCode', RefCodeschema);

/*const tokenSchema = new mongoose.Schema({
	_userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	token: { type: String, required: true },
	expireAt: { type: Date, default: Date.now, index: { expires: 5 } }
});*/


module.exports = {
	Users,
	activationTokens,
	forgetPasswordTokens,
	Userwallet,
	refferalToken,
	tokenTransactionSchema,
	RefCode
}