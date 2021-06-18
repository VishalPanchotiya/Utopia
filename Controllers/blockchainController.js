const express = require("express")
const router = express.Router()
const tronHelper = require('../helper/tronHelper');
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");

const createWallet = async (req, res) => {
    let err_msg = req.flash('err_msg');
    let success_msg = req.flash('success_msg');
    let privateKey = "";
    let test = req.session.is_user_logged_in;
    if (test != true) {
        res.redirect('/login');
    }
    else {
        let user = await Users.findOne({ 'email': req.session.re_usr_email, '_id': req.session.re_us_id });
        let passphraseNew = await tronHelper.createWallet();
        if (passphraseNew) {
            privateKey = passphraseNew;
        }
        res.render('front/dash-private-key', { privateKey, user });
    }
}

module.exports = { createWallet }

