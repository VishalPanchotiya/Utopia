const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: 'utopiaico@gmail.com',
        pass: 'utopia@quest'
    }
});


const sendResetPasswordMail = async function (reciever) {
    const message = {
        from: 'utopiaico@gmail.com', // Sender address
        to: `${reciever}`,         // List of recipients
        subject: 'Utopia Reset Password', // Subject line
        text: `Someone just requested to change/reset your Utopia account's credentials.If this was you, click on the link below to reset them.
    Link to reset credentials 
    This link will expire within 60 minutes.If you dont want to reset your credentials, just ignore this message and nothing will be changed.` // Plain text body
    };
    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}


module.exports =
    { "sendResetPasswordMail": sendResetPasswordMail }