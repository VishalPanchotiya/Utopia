const Web3 = require("web3")
const { rpcUrl, contractAddress, ownerAddress, privateKey, abi } = require("../config/contract")
const web3 = new Web3(rpcUrl);
const abidecoder = require('abi-decoder')

abidecoder.addABI(abi)

let transactionhash;
const Transfer = async function (address_to, no_of_token_to_transfer) {
    const contract = new web3.eth.Contract(abi, contractAddress, {
        from: ownerAddress, // default from address
        gasPrice: '20000000000'
    })

    const gasPrice = await web3.eth.getGasPrice();
    const gas = await contract.methods.transfer(address_to, no_of_token_to_transfer).estimateGas()
    //console.log(gasPrice)
    //console.log(gas)
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: ownerAddress,
            to: contractAddress,
            gasPrice: gasPrice,
            gas: gas,
            data: contract.methods.transfer(address_to, no_of_token_to_transfer).encodeABI(),
        },
        privateKey
    );
    // console.log("////////////////////createTransaction////////////////////")
    // console.log(createTransaction)
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction, (err, res) => {
            if (err) {
                console.log(err)
            }
            // console.log(res)
            transactionhash = res;
            //web3.eth.getTransaction(res).then(console.log)
        }
    );

    const reciept = await web3.eth.getTransactionReceipt(transactionhash)

    console.log("////////////////////DecodedLogs////////////////")
    const decodedlogs = await abidecoder.decodeLogs(reciept.logs)
    decodedlogs.forEach(token => {
        console.log(token.events[2])
    });

    const totalsupply = await contract.methods.totalSupply().call()

    console.log("Total Supply:", totalsupply)
    const balance = await contract.methods.balanceOf(ownerAddress).call()
    console.log("Admin balance :", balance)

    const balance1 = await contract.methods.balanceOf(address_to).call()
    console.log("Reciever balance :", balance1)

    return transactionhash
}

module.exports =
    { "Transfer": Transfer }