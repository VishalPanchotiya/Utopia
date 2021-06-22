const express = require("express");
const router = express.Router();
const is_user_loggedin = require("../middleware/isUserLoggedIn")
const blockchainController = require("../Controllers/blockchainController")
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");

// const tokenRoute = require("./contractMethodsRoutes");
// router.use("/token", tokenRoute);

router.get("/", function (req, res) {
    res.render('index.ejs');
});

router.get("/user-dashboard", is_user_loggedin, async (req, res) => {
    err_msg = 'err_msg';
    success_msg = 'success_msg';
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/dashboard', { user });
});


router.get("/setting-you-wallet", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/setting-you-wallet', { user });
})

router.get('/Create-wallet', is_user_loggedin, blockchainController.createWallet);

router.post("/Verify-key", is_user_loggedin, blockchainController.verifyWallet)

router.post("/verify-private-key", is_user_loggedin, async (req, res) => { })


router.get("/transaction-table", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/transaction-table', { user });
})


router.get("/kyc", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/kyc', { user });
})

router.get("/send-uwct", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/send-uwct', { user });
})

router.get("/buy-coin", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/buy-coin', { user });
})

router.get("/kyc-details", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/kyc-details', { user });
})

router.get("/receive", is_user_loggedin, async (req, res) => {
    let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.render('front/receive', { user });
})

module.exports = router;
