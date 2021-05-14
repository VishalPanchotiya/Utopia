const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');

const transfer = require("../../contractMethods/transfer.js")

router.get("/transfer", async (req, res) => {
    res.render("transfer.ejs")
})

router.post("/transfer", async (req, res) => {
    console.log("Try to transfer")
    const address_to = req.body.transfer_to;
    const no_of_token_to_transfer = req.body.no_of_token_to_transfer;
    const trxhash = await transfer.Transfer(address_to, no_of_token_to_transfer);
    console.log("Transaction Hash: ", trxhash)
    res.send(trxhash)
})



module.exports = router;