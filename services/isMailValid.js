const emailExistence = require('email-existence')

const checkMail = async (mail) => {
    emailExistence.check(mail, function (error, response) {
        console.log('res: ' + response);
        return response;
    });
}

module.exports = checkMail