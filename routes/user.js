
const express = require("express")
const router = express.Router()
const forgetPassword = require("../model/forgetPasswordToken");

const User = require("../model/User");
const activationToken = require("../model/activationToken");
const { sendOTPMail } = require("../userController/sendOTPmail")
const { loginPost } = require("../userController/loginPost")
const { signupPost } = require("../userController/signupPost")
const { sendActivationMail } = require("../userController/activateAccount")

const crypto = require('crypto');
const session = require("express-session");

router.get("/login", function (req, res) {
    console.log("get login")
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
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

router.get("/logout2", async (req, res) => {
    req.flash('success_msg', 'You have logged out successfully.');
    console.log(req.session)
    res.redirect('/login');
})

router.get("/logout", function (req, res) {
    req.session.destroy(function (err, res1) {
        if (err) { }
        else {
            console.log("User_logged_out")

            res.redirect('/logout2');
        }
    });
})

router.get("/signup", function (req, res) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
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

router.get("/activate/user/:id", async function (req, res) {
    const tokenId = req.params.id
    console.log(tokenId)
    let token = await activationToken.findOne({ '_id': tokenId });
    if (token == null) {
        console.log("Can not find activationToken");
        req.flash("err_msg", `Activation link deactivated Please enter detials to get Activation mail`)
    }
    else {
        let user = await User.findOne({ '_id': token._userId });
        user.isVerified = true;
        user.save();
        req.flash("success_msg", "Account activated successfully! You can Login")
    }
})

router.get("/activateAccount", function (req, res) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render("activateAccount")
})

router.post("/activateAccount", async function (req, res) {
    let user = await User.findOne({ 'email': req.body.email })
    if (user == null) {
        req.flash("err_msg", `${req.body.email} is not registered email address Please signup first to create account`)
        res.redirect('/activateAccount')
    }
    else if (user.isVerified == true) {
        req.flash("success_msg", `${user.name} Your account is already activated, You can Login`)
        res.redirect('/login')
    }
    else {
        sendActivationMail(user)
    }
})

router.get("/forget-password", function (req, res) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('user-forget-password')
})

router.post("/forget-password", async function (req, res) {
    let user = await User.findOne({ 'email': req.body.email });
    if (user == null) {
        req.flash('err_msg', 'Please enter valid Email,this email is not registered');
        return res.redirect('/forget-password')
    }
    else {
        const mail = await sendOTPMail(user, req, res)

    }
})

router.get("/verifyOTPForgetPassword/:id", function (req, res) {
    let id = req.params.id
    success_msg = req.flash('success_msg');
    err_msg = req.flash('err_msg');
    res.render('verifyOTPForgetPassword', { userid: id })
})

router.post("/verifyOTP/:id", async function (req, res) {
    console.log(req.body)
    console.log(req.params)
    let token = await forgetPassword.findOne({ '_userId': req.params.id });
    if (token == null) {
        req.flash('err_msg', 'Oops! OTP insert seems to be expired');
        res.redirect('/forget-password')
    }
    else {
        if (token.OTP != req.body.OTP) {
            req.flash('err_msg', 'Oops! seems like you have entered invalid OTP');
            res.redirect(`/verifyOTPForgetPassword/${req.params.id}`)
        }
        else {
            res.send("Update Password Form")
        }
    }
})
module.exports = router