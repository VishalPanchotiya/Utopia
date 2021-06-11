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


const adminTransferToken = async function (to, amount) {
    let contract = await tronWeb.contract(abi).at(contractAddress)
    //console.log(contract)
    //console.log(totalSupply.toString())
    let trx = await contract.transfer(to, amount).send()
    console.log('adminttransfer Transactionhash', trx)
    return trx
}

const transferToken = async function (sender_address, reciever_address, amount, sender_private_key) {
    const temptronWeb = await new TronWeb(fullNode, solidityNode, eventServer, sender_private_key);
    let tempcontract = await temptronWeb.contract(abi).at(contractAddress)
    //console.log(tempcontract)
    let trx = await tempcontract.transfer(reciever_address, amount).send()
    console.log(trx)
}

const totalSupply = async function () {
    let contract = await tronWeb.contract(abi).at(contractAddress)
    let totalSupply = await contract.totalSupply().call();
    console.log(totalSupply.toString())
    return totalSupply.toString()
}

const tokenBalance = async function (address) {
    let contract = await tronWeb.contract(abi).at(contractAddress)
    let balance = await contract.balanceOf(address).call();
    console.log(balance.toString())
    return balance.toString()
}

const trxBalance = async function (address) {
    let balance = await tronWeb.trx.getBalance(address);
    console.log(tronWeb.toDecimal(balance))
    //console.log(tronWeb.toSun(balance))
    console.log(balance.toString())
    return balance.toString()
}


const trxTransfer = async function (to, amount, from) {
    let trx = await tronWeb.trx.sendTransaction(to, amount, privateKey);
    console.log(trx)
}


const trxTransfer1 = async function (to, amount, from) {
    //not working just creating rawtransaction
    transaction = await tronWeb.transactionBuilder.sendTrx(to, amount, from);
    console.log('transaction', transaction)

    let signedTransaction = await tronWeb.trx.sign(transaction, privateKey);
    console.log('signedTransaction', signedTransaction)

    let trx = await tronWeb.trx.sendRawTransaction(signedTransaction);
    console.log('trx', trx)

    return transaction
}

const getTransaction = async function (transactionHash) {
    let trx = await tronWeb.trx.getTransaction(transactionHash);
    console.log(trx.ret[0])
    return trx.ret[0]
}

const createAccount = async function () {
    let accountObject = await tronWeb.createAccount()
    console.log('New Account', accountObject)
    return accountObject
}

const addressFromPrivatekey = async function (key) {
    let address = await tronWeb.address.fromPrivateKey(key)
    console.log(address)
    return address
}

//adminTransferToken('THfzazfHrzNuS8Le6jTF5Sk5sHusX9LvAX', '2');
//transferToken('THfzazfHrzNuS8Le6jTF5Sk5sHusX9LvAX', 'TKrE7EzbqisPeXZ93aV7TeiMZ39Twa8gtA', '1', 'a53c29aa929957ae43bbc0b93a97adf8ed0ba443aefe08bf43ae8af08963a2d9')
//tokenBalance('THfzazfHrzNuS8Le6jTF5Sk5sHusX9LvAX')
//totalSupply()
//trxTransfer('THfzazfHrzNuS8Le6jTF5Sk5sHusX9LvAX', '1', 'TKrE7EzbqisPeXZ93aV7TeiMZ39Twa8gtA',)
//trxBalance('THfzazfHrzNuS8Le6jTF5Sk5sHusX9LvAX')
//getTransaction('3a7a7764bad3020788a086e180ab1af7bab33a25f8c844d40ad4c48163c267e5')
//createAccount()
//addressFromPrivatekey('C790873CD976D5D54AA072908818ACA88EC4E3BAEB2AA2E03BA55B83952CDC12')


module.exports =
{
    adminTransferToken,
    transferToken,
    tokenBalance,
    totalSupply,
    trxBalance,
    trxTransfer,
    createAccount,
    getTransaction,
    addressFromPrivatekey
}