const Contract = require('../config/contracttron.json')

const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(Contract.fullNode);
const solidityNode = new HttpProvider(Contract.solidityNode);
const eventServer = new HttpProvider(Contract.eventServer);
const privateKey = Contract.privateKey;
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
tronWeb.setHeader({ "TRON-PRO-API-KEY": privateKey });
const contractAddress = Contract.address;
const address = Contract.ownerAddress;
const abi = Contract.abi

let contract = await tronWeb.contract(abi).at(contractAddress)


const Transfer = async function (to, amount) {
    let totalSupply = await contract.totalSupply().call();
    console.log(totalSupply)
    const trx = await contract.transfer(to, amount).send()
    console.log(trx)
}



module.exports =
    { "Transfer": Transfer }