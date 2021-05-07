const express = require("express");
const router = express.Router();
const is_user_login = require("../middleware/login_middleware")
const User = require("../model/User");

router.get("/", (req, res) => {
    res.send(` <h1> Welcome to Utopia ICO</h1> `);
});

router.get("/user-dashboard", is_user_login.check_user_login, async (req, res) => {
    err_msg = 'err_msg';
    success_msg = 'success_msg';
    let user = await User.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
    res.send(`<h2>You are on Dashboard</h2>` + `${user}`);
});

module.exports = router;
