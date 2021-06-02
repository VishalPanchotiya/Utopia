
const activationToken = require("../model/activationToken");
const { SERVERIP, PORT } = require("../config/test");
const mailServices = require("../services/mailServices")
const userServices = require("../services/userServices")



const sendActivationMail = async function (newuser) {

    let result = await userServices.generateActivationToken(newuser)
    console.log(`TokenId`, result)
    // const subject = 'Utopia Account Activation'
    // const reciever = `${newuser.email}`
    // const message = `
    //     <h3> Hello ${newuser.name}, </h3>
    //     <p>Thank you for registering into Utopia.</p>
    //     <p>To activate your account please follow this link:${activationTokenId}</p>
    //     <p> <a target="_" href="http://${SERVERIP}:${PORT}/activate/user/${activationTokenId}" </a>Click Here</p>
    //     <p>This link will get deactivated in 30 min</p>
    //     <p>Team Utopia</p>`;
    // mailServices.sendMail(reciever, subject, message);

}

module.exports =
    { "sendActivationMail": sendActivationMail }