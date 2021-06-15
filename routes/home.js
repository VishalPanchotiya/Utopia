const express = require("express");
const router = express.Router();
const is_user_login = require("../middleware/isUserLoggedIn")
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");

// const tokenRoute = require("./contractMethodsRoutes");
// router.use("/token", tokenRoute);

router.get("/", function (req, res) {
    res.render('index.ejs');
});

router.get("/user-dashboard", is_user_login.check_user_login, async (req, res) => {
    err_msg = 'err_msg';
    success_msg = 'success_msg';
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/dashboard');
});




module.exports = router;
