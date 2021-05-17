const crypto = require('crypto');
const User = require("../model/User");
//const { sendResetPasswordMail } = require("../userController/resetPassword")
const { sendActivationMail } = require("../userController/activateAccount")
const isMailValid = require("../services/isMailValid");

const signupPost = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_pass
    const name = req.body.name
    const code = req.body.country_code
    const phone = req.body.phone
    // const mailValidationCheck = await isMailValid(email)
    // if (mailValidationCheck == false) {
    //     req.flash('err_msg', "Please enter valid mail");
    //     res.redirect("/signup");
    // }

    if (password != conf_password) {
        req.flash('err_msg', "Password and Confirm Password should get match");
        res.redirect("/signup");
    }
    else {
        // var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
        const iv = crypto.randomBytes(16)
        const mykey = crypto.createCipher('aes-128-cbc', 'key', iv)
        var mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');

        const user = await User.findOne({ email: email })

        if (user != null && user != "" && user != undefined) {
            req.flash('err_msg', 'This email already registerd.');
            res.redirect("/signup");
        } else {
            us = {
                name: name,
                email: email,
                country_code: code,
                phone: phone,
                password: mystr,
            }
            User.create(us, (err, us1) => {
                if (err) {
                    console.log(err);
                    req.flash("err_msg", "Something went wrong please re-enter the detials to create account")
                    res.redirect('/signup');
                } else {
                    console.log(us1)
                    sendActivationMail(us1)
                    req.flash("success_msg", "Please check your inbox to activate account")
                    res.redirect('/login');
                }
            })
        }
    }

}

module.exports = { "signupPost": signupPost }