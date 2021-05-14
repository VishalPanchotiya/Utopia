const { Router } = require('express');
const router = Router()

const Web3 = require("web3")
const { rpcUrl, contractAddress, ownerAddress, privateKey, abi } = require("../../config/contract")
const web3 = new Web3(rpcUrl);

const contract = new web3.eth.Contract(abi, contractAddress, {
})

router.get("/totalSupply", async (req, res) => {
    const totalsupply = await contract.methods.totalSupply().call()
    res.send(totalsupply)
})

router.get("/balanceOf", async (req, res) => {
    const balance = await contract.methods.balanceOf(ownerAddress).call()
    res.send(balance)
})

module.exports = router