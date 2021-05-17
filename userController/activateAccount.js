
const activationToken = require("../model/activationToken");
const { SERVERIP, PORT } = require("../config/test");
const sendMail = require("../services/mail")
const sendActivationMail = async function (newuser) {
    let activationTokenId;
    await activationToken.create({
        _userId: newuser._id,
        email: newuser.email,
    }, (err, actoken1) => {
        if (err) {
            console.log(err);
        } else {
            activationTokenId = actoken1._id;
            console.log(`activation token generated for ${newuser.name}    ${activationTokenId}`);

            console.log(actoken1)

            const subject = 'Utopia Account Activation'
            const reciever = `${newuser.email}`
            const message = `
            <h3> Hello ${newuser.name}, </h3>
            <p>Thank you for registering into Utopia.</p>
            <p>To activate your account please follow this link:</p>
            <p> <a target="_" href="http://${SERVERIP}:${PORT}/activate/user/${activationTokenId}" </a>Click Here</p>
            <p>This link will get deactivated in 30 min</p>
            <p>Team Utopia</p>`;
            sendMail(reciever, subject, message);
        }
    })
}

module.exports =
    { "sendActivationMail": sendActivationMail }