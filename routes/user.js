
const express = require("express")
const router = express.Router()
const User = require("../model/User");
const activationToken = require("../model/activationToken");
const { sendResetPasswordMail } = require("../userController/resetPassword")
const { loginPost } = require("../userController/loginPost")
const { signupPost } = require("../userController/signupPost")
const { sendActivationMail } = require("../userController/activateAccount")

const crypto = require('crypto');

router.get("/login", function (req, res) {
    console.log("get login")
    //err_msg = req.flash('err_msg');
    // success_msg = req.flash('success_msg');
    var test = req.session.is_user_logged_in;
    if (test != undefined || test === true) {
        res.redirect('/user-dashboard');
    } else {
        res.render('user-login')
    }
})


router.post('/login', async function (req, res) {
    await loginPost(req, res);
})

router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        console.log("User_logged_out")
    });
    //req.flash('success_logout', 'You have logged out successfully.');
    res.redirect('/');
})

router.get("/signup", function (req, res) {
    //err_msg = req.flash('err_msg');
    //success_msg = req.flash('success_msg');
    const test = req.session.is_user_logged_in;
    console.log("test", test)
    if (test == true) {
        res.redirect('/');
    } else {
        res.render('user-signup')
    }
})

router.post('/signup', async function (req, res) {
    await signupPost(req, res);
})

router.get("/forget-password", function (req, res) {
    res.render('user-forget-password')
})

router.get("/activate/user/:id", async function (req, res) {
    const tokenId = req.params.id
    console.log(tokenId)
    let token = await activationToken.findOne({ '_id': tokenId });
    if (token == null) {
        console.log("Can not find activationToken");
        res.send(
            `<h2>Activation link deactivated Resend Activation mail</h2>`
        )
    }
    else {
        let user = await User.findOne({ '_id': token._userId });
        user.isVerified = true;
        user.save();
        res.send(`Account activated successfully`)
    }
})

router.get("/activateAccount", function (req, res) {
    res.render("activateAccount")
})

router.post("/activateAccount", async function (req, res) {
    let user = await User.findOne({ 'email': req.body.email })
    if (user == null) {
        res.send(`<h2>${req.body.email} is not registered email address</h2>`)
    }
    sendActivationMail(user)
})

router.post("/forget-password", async function (req, res) {
    console.log(req.body.password)
    let user = await User.findOne({ 'email': req.body.email });
    if (user == null) {
        console.log("user nahi mila");
        //req.flash('err_msg', 'Please enter valid Email address.');
        res.redirect('/forgetpassword')
    }
    else {
        const mail = sendResetPasswordMail(user.email)
        res.send(`check inbox of ${user.email} `)
    }
})

module.exports = router