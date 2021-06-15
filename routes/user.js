
const express = require("express")
const crypto = require('crypto');
const session = require("express-session");
const router = express.Router()
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");
const { sendOTPMail } = require("../Controllers/sendOTPmail")
const userServices = require("../services/userServices")
const is_user_login = require("../middleware/isUserLoggedIn")


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
    await userServices.loginPost(req, res);
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
        res.redirect('/user-dashboard');
    } else {
        res.render('user-signup')
    }
})

router.post('/signup', async function (req, res) {
    await userServices.signupPost(req, res);
})

router.get("/activate/user/:id", async function (req, res) {
    const tokenId = req.params.id
    console.log(tokenId)
    let token = await activationTokens.findOne({ '_id': tokenId });
    if (token == null) {
        console.log("Can not find activationToken");
        req.flash("err_msg", `Activation link deactivated Please enter detials to get Activation mail`)
        res.redirect("/activateAccount")
    }
    else {
        let user = await Users.findOne({ '_id': token._userId });
        user.isVerified = true;
        await user.save();
        req.flash("success_msg", "Account activated successfully! You can Login")
        res.redirect('/login')
    }
})

router.get("/activateAccount", function (req, res) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render("activateAccount")
})

router.post("/activateAccount", async function (req, res) {
    let user = await Users.findOne({ 'email': req.body.email })
    if (user == null) {
        req.flash("err_msg", `${req.body.email} is not registered email address Please signup first to create account`)
        res.redirect('/activateAccount')
    }
    else if (user.isVerified == true) {
        req.flash("success_msg", `${user.name} Your account is already activated, You can Login`)
        res.redirect('/login')
    }
    else {
        console.log('94 activate Account')
        await userServices.sendActivationMail(user)
        req.flash("success_msg", `${user.name} We have sent an Activation link to you please check your Email to activate your account`)
        res.redirect('/login')
    }
})

router.get("/forget-password", function (req, res) {
    err_msg = req.flash('err_msg');
    success_msg = req.flash('success_msg');
    res.render('user-forget-password')
})

router.post("/forget-password", async function (req, res) {
    let user = await Users.findOne({ 'email': req.body.email });

    if (user == null) {
        req.flash('err_msg', 'Please enter valid Email,this email is not registered');
        return res.redirect('/forget-password')
    }
    else {
        let user_id = user._id
        let otp = await userServices.forgetPassword(user)
        console.log('116 user.js OTP', otp)
        sendOTPMail(req, res, otp, user_id)
        //const mail = await sendOTPMail(user, req, res)
    }
})

router.get("/user-update-Password", is_user_login.check_user_login, async function (req, res) {
    res.send("Update Password Page")
})

router.post("/user-update-Password", is_user_login.check_user_login, async function (req, res) {
    console.log(req.body)
})


// router.get("/verifyOTPForgetPassword/:id", async function (req, res) {
//     let id = req.params.id
//     //const timeleft = await userServices.otpexpire(req.params.id)
//     //console.log(timeleft);
//     success_msg = req.flash('success_msg');
//     err_msg = req.flash('err_msg');
//     res.render('verifyOTPForgetPassword', { userid: id })
// })
// router.post("/verifyOTP/:id", async function (req, res) {
//     console.log(req.body)
//     console.log(req.params)
//     let token = await forgetPasswordTokens.findOne({ '_userId': req.params.id });
//     if (token == null) {
//         req.flash('err_msg', 'Oops! OTP insert seems to be expired');
//         res.redirect('/forget-password')
//     }
//     else {
//         if (token.OTP != req.body.OTP) {
//             req.flash('err_msg', 'Oops! seems like you have entered invalid OTP');
//             res.redirect(`/verifyOTPForgetPassword/${req.params.id}`)
//         }
//         else {
//             res.send("Update Password Form")
//         }
//     }
// })

module.exports = router