const nodemailer = require('nodemailer');
const { MAIL, PASS } = require("../config/test");


let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: MAIL,
        pass: PASS
    }
});
const sendMail = async (reciever, subject, message) => {
    const detial = {
        from: MAIL, // Sender address
        to: reciever,         // List of recipients
        subject: subject, // Subject line
        html: message
    };
    transport.sendMail(detial, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info)
            console.log(`${subject} mail is sended please check your mailbox`)
        }
    });
}

module.exports = sendMail