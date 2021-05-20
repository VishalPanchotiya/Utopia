
const forgetPassword = require("../model/forgetPasswordToken");
const { SERVERIP, PORT } = require("../config/test");
const sendMail = require("../services/mail")

const otpGenerator = require('otp-generator')

otpGenerator.generate(6, { upperCase: false, specialChars: false });

const sendOTPMail = async function (user, req, res) {
    const token = await forgetPassword.findOne({ '_userId': user._id })
    let forgetPasswordTokenId;
    let otp = await otpGenerator.generate(6, { upperCase: false, specialChars: false });
    //console.log(token)
    if (token != null) {

        req.flash('err_msg', 'We have sended you an OTP,You can regenerate OTP after some time');
        res.redirect(`/verifyOTPForgetPassword/${user._id}`)
    }
    else {
        await forgetPassword.create({
            OTP: otp,
            _userId: user._id,
            email: user.email,
        }, (err, forgetPasswordToken) => {
            if (err) {
                // console.log(err);
                console.log("yaha error hai")
                req.flash('err_msg', 'You can regenerate OTP after some timeS');
                res.redirect("/forget-password")
            } else {
                console.log(`ForgetPasswordToken token generated for ${user.name}`);

                console.log(forgetPasswordToken)

                const subject = 'Utopia OTP Forget Password'
                const reciever = `${user.email}`
                const message = `
            <h3> Hello ${user.name}, </h3>
            <p>Thank you for using Utopia.</p>
            <p>Here is your OTP Please don't share this with anybody</p>
            <p> <h2>${otp}</h2></p>
            <p>This will be valid for 3 mins</p>
            <p>Team Utopia</p>`;
                sendMail(reciever, subject, message);
                req.flash('success_msg', 'OTP has been sent to your Email,Please check your Inbox or Spam');
                res.redirect(`/verifyOTPForgetPassword/${user._id}`)
            }
        })
    }
}

module.exports =
    { "sendOTPMail": sendOTPMail }