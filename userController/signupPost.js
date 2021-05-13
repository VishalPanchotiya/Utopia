const crypto = require('crypto');
const User = require("../model/User");
//const { sendResetPasswordMail } = require("../userController/resetPassword")
const { sendActivationMail } = require("../userController/activateAccount")


const signupPost = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name
    const code = req.body.country_code
    const phone = req.body.phone
    // var mykey = crypto.createCipher('aes-128-cbc', 'mypass');
    const iv = crypto.randomBytes(16)
    const mykey = crypto.createCipher('aes-128-cbc', 'key', iv)
    var mystr = mykey.update(password, 'utf8', 'hex')
    mystr += mykey.final('hex');

    const user = await User.findOne({ email: email })

    if (user != null && user != "" && user != undefined) {
        // req.flash('err_msg', 'This email already registerd.');
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
                res.redirect('/signup');
            } else {
                console.log(us1)
                sendActivationMail(us1)
                res.send('<h1>Please check your inbox to activate account</h1>')

            }
        })
    }
}

module.exports = { "signupPost": signupPost }