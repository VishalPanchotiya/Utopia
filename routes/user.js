
const express = require("express")
const router = express.Router()
const User = require("../model/User");
const session = require('express-session');
const bodyParser = require('body-parser');

var crypto = require('crypto');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get("/login", function (req, res) {
    console.log("get login")
    //err_msg = req.flash('err_msg');
    // success_msg = req.flash('success_msg');
    var test = req.session.is_user_logged_in;
    if (test != undefined || test === true) {
        res.redirect('/');
    } else {
        res.render('user-login')
    }
})

//request to store user data from registration page 
router.post('/login', async function (req, res) {
    console.log(req.session)
    console.log("login post")
    const password = req.body.password;
    const iv = crypto.randomBytes(16)
    const mykey = crypto.createCipher('aes-128-cbc', 'key', iv)
    var mystr = mykey.update(password, 'utf8', 'hex')
    mystr += mykey.final('hex');
    //console.log(mystr)
    let user = await User.findOne({ 'email': req.body.email, 'password': mystr });
    if (user == null) {
        console.log("user nahi mila");
        //req.flash('err_msg', 'Please enter valid Email address.');
        res.redirect('/login')
    } else {
        //console.log(user.username)
        req.session.success = true;
        req.session.is_user_logged_in = true;
        req.session.re_us_id = user._id;
        req.session.re_usr_email = user.email;
        req.session.name = user.name;
        //console.log(user);
        console.log(req.session)
        res.redirect('/user-dashboard')
    }
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

//request to store user data from registration page 
router.post('/signup', async function (req, res) {
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
                res.redirect('/login');
            }
        })
    }
})

module.exports = router