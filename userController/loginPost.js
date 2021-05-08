const crypto = require('crypto');
const User = require("../model/User");


const loginPost = async function (req, res) {
    console.log(req.session)
    console.log("login post")
    const password = req.body.password;
    const iv = crypto.randomBytes(16)
    const mykey = crypto.createCipher('aes-128-cbc', 'key', iv)
    var mystr = mykey.update(password, 'utf8', 'hex')
    mystr += mykey.final('hex');
    //console.log(mystr)
    let user = await User.findOne({ 'email': req.body.email, 'password': mystr });
    if (user == null) {
        console.log("user note found");
        //req.flash('err_msg', 'Please enter valid Email address.');
        res.redirect('/login')
    } else {
        req.session.success = true;
        req.session.is_user_logged_in = true;
        req.session.re_us_id = user._id;
        req.session.re_usr_email = user.email;
        req.session.name = user.name;
        //console.log(user);
        //console.log(req.session)
        res.redirect('/user-dashboard')
    }

}

module.exports = { "loginPost": loginPost }