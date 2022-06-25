const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const hlp = require('../helpers/helpers');

const constant = require('../../config/constant');

const User = require('../models/User');
const Session = require('../models/Session');
const UserModule = require('../models/UserModule');
const flash = require('express-flash');


// const User = UserModel.User;
// const UserRaw = UserModel.UserRaw;



const message = (req) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    return message;
}

const oldInput = (req) => {
    let oldInput = req.flash('oldInput');
    if (oldInput.length > 0) {
        oldInput = oldInput[0];
    } else {
        oldInput = {name: null, email: null}
    }

    return oldInput;
}

exports.login = (req, res, next) => {
    if (req.method == 'POST') {
        const validationErrors = [];
        if (!validator.isEmail(req.body.inputEmail)) validationErrors.push('Email tidak valid');
        if (validator.isEmpty(req.body.inputPassword)) validationErrors.push('Password tidak boleh kosong');
        if (validationErrors.length) {
            req.flash('error', validationErrors);
            return res.redirect('/login');
        }
        User.tUser.findOne({ where: { email: req.body.inputEmail } })
            .then(user => {
                if (user) {
                    // kalau password nya = default password, kita lempar ke halaman ganti password
                    if(user.dataValues.password==hlp.md5(constant.MY_DEFAULTPASSWORD)) {
                        req.session.isLoggedIn = true;
                        req.session.userId = user.dataValues.userId;
                        req.session.user = user.dataValues;

                        return res.redirect('/login-changepassword');
                    }

                    bcrypt
                        .compare(req.body.inputPassword, user.password)
                        .then(doMatch => {
                            if (doMatch) {
                                let uid = user.dataValues.userId
                                req.session.isLoggedIn = true;
                                req.session.user = user.dataValues;
                                req.session.userId = uid;

                                // ambil hak akses
                                UserModule.userModule_get({ opt_select: ["moduleName"], userId: req.session.userId })
                                    .then(data => { data.forEach(e => { req.session['pm_' + e.moduleName.toLowerCase()] = true; }) });

                                hlp.genAlert(req, { message: constant.MY_USERWELCOME + user.dataValues.fullname });

                                user.lastLogin = hlp.now();
                                user.save();

                                return req.session.save(err => {
                                    console.log(err);
                                    res.redirect('/admin');
                                });
                            }
                            req.flash('error', constant.MY_USERPASSNOTMATCHED);
                            req.flash('oldInput', { email: req.body.inputEmail });
                            return res.redirect('/login');
                        })
                        .catch(err => {
                            console.log(err);
                            req.flash('error', 'Sorry! Something went wrong.');
                            req.flash('oldInput', { email: req.body.inputEmail });
                            return res.redirect('/login');
                        });
                } else {
                    req.flash('error', constant.MY_USERDOESNOTEXISTS);
                    req.flash('oldInput', { email: req.body.inputEmail });
                    return res.redirect('/login');
                }
            })
            .catch(err => console.log(err));
    } else {
        if (res.locals.isAuthenticated) {
            res.redirect('/admin');
        } else {
            res.render('layouts/login_layout', { pages: '../pages/login', pageTitle: 'Login', errorMessage: message(req), oldInput: oldInput(req) });
        }
    }


};

exports.logout = (req, res, next) => {
    if (res.locals.isAuthenticated) {
        req.session.destroy(err => {
            return res.redirect('/');
        });
    } else {
        return res.redirect('/');
    }
};


exports.signUp = (req, res, next) => {
    if (req.method == 'POST') {
        User.vUser.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (!user) {
                    User.user_add({ fullname: req.body.name, email: req.body.email, password: req.body.password });
                    return res.redirect('/login');
                } else {
                    req.flash('error', 'E-Mail exists already, please pick a different one.');
                    req.flash('oldInput', { name: req.body.name });
                    return res.redirect('/sign-up');
                }
            })
            .catch(err => console.log(err));
    }
    res.render('layouts/login_layout', { pages: '../pages/register', pageTitle: 'Register', errorMessage: message(req), oldInput: oldInput(req) });
};

exports.forgotPassword = (req, res, next) => {
    if (req.method=='POST') {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email)) validationErrors.push('Please enter a valid email address.');
    
        if (validationErrors.length) {
            req.flash('error', validationErrors);
            return res.redirect('/forgot-password');
        }
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
                return res.redirect('/forgot-password');
            }
            const token = buffer.toString('hex');
            User.vUser.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(user => {
                    if (!user) {
                        req.flash('error', 'No user found with that email');
                        return res.redirect('/forgot-password');
                    }
                    user.resetToken = token;
                    user.resetTokenExpiry = Date.now() + 3600000;
                    return user.save();
                }).then(result => {
                    if (result) return res.redirect('/resetlink');
                }).catch(err => { console.log(err) })
        });
    } else {
        if (res.locals.isAuthenticated) {
            return res.redirect('/profile');
        } else {
            return res.render('login_layout', { pages: '../pages/forgot_password', pageTitle: 'Forgot Password', errorMessage: message(req), oldInput: oldInput(req) });
        }
    }
};

exports.changePassword = (req, res, next) => {

    if (req.method == 'POST') {
        User.tUser.findOne({raw: true, where: {userId: req.body.userId}})
        .then(user => {  
            if(user) {
                bcrypt.hash(req.body.password1, 12)
                .then(hashed=> {
                    User.user_edit({userId: req.body.userId, password: hashed})
                    .then(r => {
                        hlp.genAlert(req,{message: constant.MY_USERPASSWORDCHANGED});
                        return res.redirect('/logout');
                    })
                });            
            }  else {
                return res.redirect('/logout');
            }
        });
    } else {
        User.tUser.findOne({raw: true, where: {userId: req.session.userId}})
        .then(result => {    
            
            if(result){
                let vars = {
                     q_user: result,
                     pages: '../pages/login_changepassword',
                     pageTitle: 'Ganti Password'
                 };
                 res.render('layouts/login_layout', vars); 
            } else {
                hlp.genAlert(req,{tipe:'error', message: constant.MY_USERDOESNOTEXISTS});
                return res.redirect('/login');
            }
    

        });
    }
};