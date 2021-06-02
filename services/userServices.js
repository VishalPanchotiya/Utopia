const mailServices = require("../services/mailServices")
const { SERVERIP, PORT } = require("../config/test");
const activationToken = require("../model/activationToken")

const generateActivationToken = async function (newuser) {
    activationToken.create({
        _userId: newuser._id,
        email: newuser.email,
    }, async (err, actoken) => {
        if (err) {
            console.log(err);
        } else {
            console.log(actoken)
            let activationTokenId = actoken._id;
            console.log(`activation token generated for ${newuser.name}    ${activationTokenId}`);

            const subject = 'Utopia Account Activation'
            const reciever = `${newuser.email}`
            const message = `
            <h3> Hello ${newuser.name}, </h3>
            <p>Thank you for registering into Utopia.</p>
            <p>To activate your account please follow this link:${activationTokenId}</p>
            <p> <a target="_" href="http://${SERVERIP}:${PORT}/activate/user/${activationTokenId}" </a>Click Here</p>
            <p>This link will get deactivated in 30 min</p>
            <p>Team Utopia</p>`;
            await mailServices.sendMail(reciever, subject, message);
            return activationTokenId
        }
    })
}


module.exports = { "generateActivationToken": generateActivationToken }