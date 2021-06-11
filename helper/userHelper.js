const express = require("express")
const crypto = require('crypto');
const session = require("express-session");
const router = express.Router()
const { activationTokens, forgetPasswordTokens, Users } = require("../model/userModels");

function generateCode() {
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    var len = string.length;
    for (let i = 0; i < 10; i++) {
        code += string[Math.floor(Math.random() * len)];
    }
    return code;
}

const createUserObject = async function (req) {
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_pass
    const name = req.body.name
    const code = req.body.country_code
    const phone = req.body.phone
    let ref_code = generateCode();
    console.log('25 useHelper ref_code', ref_code)
    let newUser = {
        name: name,
        email: email,
        country_code: code,
        phone: phone,
        password: mystr,
        ref_code: ref_code
    }
    return newUser
}


module.exports = {
    generateCode,
    createUserObject
}