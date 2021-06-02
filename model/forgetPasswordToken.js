const mongoose = require('mongoose');
const validator = require('validator');
const tokenSchema = new mongoose.Schema({
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
}
)
/*const tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    expireAt: { type: Date, default: Date.now, index: { expires: 5 } }
});*/
module.exports = mongoose.model('forgetPasswordTokens', tokenSchema);