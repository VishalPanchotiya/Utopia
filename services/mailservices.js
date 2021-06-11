const nodemailer = require('nodemailer');
const { MAIL, PASS } = require("../config/test");

const emailExistence = require('email-existence')

let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: MAIL,
        pass: PASS
    }
});
const sendMail = async (reciever, subject, message) => {
    console.log('In send mail')
    const detial = {
        from: MAIL,           // Sender address
        to: reciever,         // List of recipients
        subject: subject,     // Subject line
        html: message
    };
    transport.sendMail(detial, function (err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log(info);
            console.log(`${reciever}  ${subject} mail is sended please check your mailbox`);
        }
    });
}


const checkMail = async (mail) => {
    emailExistence.check(mail, function (error, response) {
        console.log('res: ' + response);
        return response;
    });
}





module.exports = {
    "sendMail": sendMail,
    "checkMail": checkMail
}