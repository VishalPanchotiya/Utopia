const express = require("express");
const router = express.Router();
var homeroutes = require("./home.js");
const userRoute = require("./user.js");
const tokenRoute = require("./contractMethodsRoutes");

router.use('/', homeroutes);

router.use("/user", userRoute);

router.use("/token", tokenRoute);

module.exports = router;
