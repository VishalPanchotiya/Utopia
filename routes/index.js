const express = require("express");
const router = express.Router();
var homeroutes = require("./home.js");
const userRoute = require("./user.js");


router.use('/', homeroutes);

router.use("/", userRoute);

module.exports = router;
