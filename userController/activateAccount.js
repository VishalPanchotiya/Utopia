const nodemailer = require('nodemailer');
const { PORT } = require("../config/test");
const { SERVERIP } = require("../config/test");
const { MAIL } = require("../config/test");
const { PASS } = require("../config/test");
const activationToken = require("../model/activationToken");
let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: MAIL,
        pass: PASS
    }
});

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

            const message = {
                from: MAIL, // Sender address
                to: `${newuser.email}`,         // List of recipients
                subject: 'Utopia Account Activation', // Subject line
                html: `
                <h3> Hello ${newuser.name}, </h3>
                <p>Thank you for registering into Utopia.</p>
                <p>To activate your account please follow this link:</p>
                <p> <a target="_" href="http://${SERVERIP}:${PORT}/activate/user/${activationTokenId}" </a>Click Here</p>
                <p>This link will get deactivated in 30 min</p>
                <p>Team Utopia</p>`};
            transport.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    res.send("Account activation link is sended please check your mailbox")
                }
            });
        }
    })
}

module.exports =
    { "sendActivationMail": sendActivationMail }