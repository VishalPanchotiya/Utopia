const session = require('express-session');

const check_user_login = (req, res, next) => {
    console.log(req.session)
    const check_user = req.session.re_us_id;
    console.log(check_user);

    if (check_user === false || check_user === undefined) {
        return res.redirect('/login');
    }
    next();
};

module.exports =
    { "check_user_login": check_user_login }