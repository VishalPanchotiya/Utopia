
const express = require("express")
const router = express.Router()
const User = require("../model/User");
const { sendResetPasswordMail } = require("../userController/resetPassword")
const { loginPost } = require("../userController/loginPost")
const { signupPost } = require("../userController/signupPost")


var crypto = require('crypto');

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
        res.send(`check inbox of ${user.email}`)
    }
})

module.exports = router