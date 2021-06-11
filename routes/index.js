const express = require("express");
const router = express.Router();
var homeroutes = require("./home.js");
const userRoute = require("./user.js");
const flash = require('req-flash');
router.use(flash());

router.use('/', homeroutes);
router.use('/', userRoute);


module.exports = router