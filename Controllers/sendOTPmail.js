
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");
const { SERVERIP, PORT } = require("../config/test");
const mailServices = require("../services/mailServices")
const userServices = require("../services/userServices")

// async function resetResend(user_id) {
//     const token = await forgetPasswordTokens.findOne({ '_userId': user_id })
//     token.resend = true
//     token.save();
//     console.log("user can req to resend otp", token)
// }

const sendOTPMail = async function (req, res, otp, user_id) {
    console.log(otp)
    let user = await Users.findOne({ '_id': user_id });

    console.log(`ForgetPasswordToken token generated for ${user.name}`);
    const subject = 'Utopia OTP Forget Password'
    const reciever = `${user.email}`
    const message = `
        <h3> Hello ${user.name}, </h3>
        <p>Thank you for using Utopia.</p>
        <p>Here is your OTP Please don't share this with anybody</p>
        <p> <h2>${otp}</h2></p>
        <p>This will be valid for 10 mins</p>
        <p>Team Utopia</p>`;
    await mailServices.sendMail(reciever, subject, message)
    req.flash('err_msg', 'Please check your register email we have sent an OTP for Login');
    res.redirect('/login')
}


/*const sendOTPMail = async function (user, req, res) {
    const token1 = await forgetPasswordTokens.findOne({ '_userId': user._id })
    let forgetPasswordTokenId;
    //console.log(token)
    if (token1 == null) {
        await Mail(req, res, user)
    }
    else {
        if (token1.resend != undefined && token1.resend == false) {
            if (token1.resend != null) {
                req.flash('err_msg', 'We have sended you an OTP,You can regenerate OTP after 120 sec');
                res.redirect(`/verifyOTPForgetPassword/${user._id}`)
            }
        }
        else {
            if (token1 != null) await token1.delete();
            if (token1 == null || token1 == undefined) {
                // console.log(err);
                req.flash('err_msg', 'Opps! Something went wrong please resubmit');
                res.redirect("/forget-password")
            } else {
                await Mail(req, res, user, otp);
            }
        }
    }
}*/

module.exports =
    { "sendOTPMail": sendOTPMail }