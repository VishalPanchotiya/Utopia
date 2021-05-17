const express = require("express");
const router = express.Router();
var homeroutes = require("./home.js");
const userRoute = require("./user.js");
const tokenRoute = require("./contractMethodsRoutes");
const flash = require('req-flash');
router.use(flash());
router.use('/', homeroutes);

router.use(userRoute);

router.use("/token", tokenRoute);

module.exports = router;
