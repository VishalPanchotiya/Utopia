const express = require('express');
const router = express.Router();

const readRoute = require("./readmethods.js");
router.use("/read", readRoute);
const writeRoute = require("./writemethods.js");
router.use("/write", writeRoute);

module.exports = router;