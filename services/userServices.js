const crypto = require('crypto');
const mailServices = require("../services/mailServices")
const { SERVERIP, PORT } = require("../config/test");
const { activationTokens, forgetPasswordTokens, Users, RefCode } = require("../model/userModels");
const otpGenerator = require('otp-generator')
const userHelper = require("../helper/userHelper")

const checkUser = async function (email) {
    const user = await Users.findOne({ email: email })
    if (user) {
        return user
    }
    else {
        return false
    }
}

const checkUserFromId = async function (id) {
    const user = await Users.findOne({ _id: id })
    if (user) {
        return user
    }
    else {
        return false
    }
}

const referData = async (ref_code, ref_link, id, created) => {
    const referObject = {
        my_ref_code: ref_code,
        reg_ref_code: ref_link,
        created_at: created,
        user_id: id
    };
    try {
        const refData = new RefCode(referObject);
        await refData.save();
        return referObject;
    } catch (error) {
        console.log("Error", error.message);
    }
};


const generateActivationToken = async function (newuser) {
    let tokenObject = {
        _userId: newuser._id,
        email: newuser.email,
    }
    let token = new activationTokens(tokenObject)
    await token.save()
    if (token == null || token == undefined) {
        req.flash('err_msg', 'Opps! Something went wrong try login to get activation account email');
        res.redirect("/login")
    } else {
        console.log(token)
        let activationTokenId = token._id;
        return activationTokenId
    }
}

function generateCode() {
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    var len = string.length;
    for (let i = 0; i < 10; i++) {
        code += string[Math.floor(Math.random() * len)];
    }
    return code;
}

const generateForgetPasswordToken = async function (user) {
    let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false })
    let tokenObject = {
        OTP: otp,
        _userId: user._id,
        email: user.email,
        resend: false
    }
    token = new forgetPasswordTokens(tokenObject)
    await token.save()
    return token
}

const sendActivationMail = async function (newuser) {
    let activationTokenId = await generateActivationToken(newuser)
    console.log(`26 userServices TokenId`, activationTokenId)
    const subject = 'Utopia Account Activation'
    const reciever = `${newuser.email}`
    const message = `
        <h3> Hello ${newuser.name}, </h3>
        <p>Thank you for registering into Utopia.</p>
        <p>To activate your account please follow this link:</p>
        <p> <a target="_" href="http://${SERVERIP}:${PORT}/activate/user/${activationTokenId}" </a>Click Here</p>
        <p>This link will get deactivated in 30 min</p>
        <p>Team Utopia</p>`;
    await mailServices.sendMail(reciever, subject, message);
    return;
}

async function nullOTP(user) {
    if (user.OTP != null) {
        user.OTP = null
        await user.save()
        console.log(user)
    }
}


const forgetPassword = async function (user) {
    let new_pass = Math.random().toString(36).slice(-8);
    let mystr1 = await createCipher(new_pass);
    console.log(new_pass)
    user.OTP = mystr1
    await user.save()
    console.log(user)
    setTimeout(function () { nullOTP(user); }, 600000);
    return new_pass
}


const otpexpire = async function (user_id) {
    const token = await forgetPasswordTokens.findOne({ '_userId': user_id })
    // console.log("Expired token", token);
    const created = token.created_at;
    // console.log(expiry); 
    const date = Date.now;
    // console.log(date);
    //const temp = expiry - date;
    const timediff = Math.round((created.getTime() - date.getTime()) / 1000);
    console.log(timediff);
    return timediff;
}

const createCipher = async function (str) {
    const iv = crypto.randomBytes(16)
    const mykey = crypto.createCipher('aes-128-cbc', 'key', iv)
    var mystr = mykey.update(str, 'utf8', 'hex')
    mystr += mykey.final('hex');
    return mystr
}

const signupPost = async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_pass

    if (password != conf_password) {
        req.flash('err_msg', "Password and Confirm Password should get match");
        res.redirect("/signup");
    }
    else {
        mystr = await createCipher(password)
        const user = await Users.findOne({ email: email })
        if (user != null && user != "" && user != undefined) {
            req.flash('err_msg', 'This email already registerd.');
            res.redirect("/signup");
        } else {
            let newUser = await userHelper.createUserObject(req)
            Users.create(newUser, async (err, us1) => {
                if (err) {
                    console.log(err);
                    req.flash("err_msg", "Something went wrong please re-enter the detials to create account")
                    res.redirect('/signup');
                } else {
                    console.log('98 userServices', us1)
                    await sendActivationMail(us1)
                    req.flash("success_msg", "Please check your inbox to activate account")
                    res.redirect('/login');
                }
            })
        }
    }
}

const createUserSession = async function (req, res, user) {
    req.session.success = true;
    req.session.is_user_logged_in = true;
    req.session.re_us_id = user._id;
    req.session.re_usr_email = user.email;
    req.session.name = user.name;
    // console.log(user);
    // console.log(req.session)
}


const loginPost = async function (req, res) {
    console.log(req.session)
    console.log("login post")
    const password = req.body.password;
    mystr = await createCipher(password)
    console.log('119 userServices', mystr)
    let user = await Users.findOne({ 'email': req.body.email, });
    if (user == null) {
        console.log("user note found");
        req.flash('err_msg', 'Email address is not registered');
        res.redirect('/login')
    } else {
        if (user.isVerified == false) {
            req.flash('err_msg', 'Your Account is not activated Please enter detials to activate account');
            res.redirect('/activateAccount')
        }
        else if (mystr != user.password) {
            if (user.OTP != undefined) {
                if (mystr != user.OTP) {
                    req.flash('err_msg', 'Incorrect password');
                    res.redirect('/login')
                }
                else {
                    await createUserSession(req, res, user)
                    user.OTP = null
                    await user.save()
                    res.redirect('/user-update-Password')
                }
            }
            else {
                req.flash('err_msg', 'Incorrect password');
                res.redirect('/login')
            }
        }
        else {
            await createUserSession(req, res, user)
            res.redirect('/user-dashboard')
        }
    }
}

const updateProfile = async function (req, res) {
    let user_id = req.session.re_us_id
    let name = req.body.name.trim();
    let email = req.body.email.trim();
    let mob = req.body.phone.trim();
    let dob = req.body.dob.trim();
    let country = req.body.country.trim();
    let city = req.body.city.trim();

    Users.updateOne({ _id: user_id }, { $set: { name: name, email: email, phone: mob, dob: dob, country: country, city: city } }, { upsert: true }, function (err, result) {
        if (err) {
            console.log("Something went wrong");
            req.flash('err_msg', 'Something went wrong, please try again.');
            res.redirect('/profile')
        } else {
            req.flash('success_msg', 'Profile updated successfully.');
            res.redirect('/profile')
        }
    });
}


const updateUserPassword = async function (id, password) {
    user = await checkUserFromId(id)
    mystr = await createCipher(password)
    user.password = mystr;
    let result = await user.save().then(succ => {
        //console.log(`241 userServisces updatePassword ${succ}`)
        return true
    }).catch(err => {
        console.log(err);
        return false
    })
    console.log(result)
    return result
}

const changePassword = async function (req, res) {
    id = req.session.re_us_id
    user = await checkUserFromId(id)
    let currentPassword = req.body.currentPassword
    let currentPasswordCipher = await createCipher(currentPassword)
    if (user.password == currentPasswordCipher) {
        let newPassword = req.body.newPassword
        let confPassword = req.body.confPassword
        if (newPassword == confPassword) {
            result = await updateUserPassword(id, newPassword)
            if (result) {
                req.flash('success_msg', 'Password updated successfully.');
                res.redirect('/profile')
            }
            else {
                req.flash('err_msg', 'Something went wrong Please retry');
                res.redirect('/profile')
            }
        }
        else {
            req.flash('err_msg', 'New password not confirmed correctly please retry');
            res.redirect('/profile')
        }
    }
    else {
        req.flash('err_msg', 'Entered Wrong Current Password');
        res.redirect('/profile')
    }
}


module.exports = {
    checkUser,
    checkUserFromId,
    generateActivationToken,
    generateForgetPasswordToken,
    sendActivationMail,
    forgetPassword,
    signupPost,
    loginPost,
    otpexpire,
    createCipher,
    updateUserPassword,
    updateProfile,
    changePassword
}