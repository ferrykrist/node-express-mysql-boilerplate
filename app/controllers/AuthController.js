const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const hlp = require('../helpers/helpers');

const constant = require('../../config/constant');

const User = require('../models/User');
const Session = require('../models/Session');
const UserModule = require('../models/UserModule');
const Departement = require('../models/Departements');
const Modules = require('../models/Modules');

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
        oldInput = { name: null, email: null }
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
        User.vUser.findOne({ where: { email: req.body.inputEmail } })
            .then(user => {
                if (user) {
                    // kalau password nya = default password, kita lempar ke halaman ganti password
                    if (user.dataValues.password == hlp.md5(constant.MY_DEFAULTPASSWORD)) {
                        req.session.isLoggedIn = true;
                        req.session.userId = user.dataValues.userId;
                        req.session.user = user.dataValues;
                        return res.redirect('/login-changepassword');
                    }
                    bcrypt
                        .compare(req.body.inputPassword, user.password)
                        .then(doMatch => {
                            if (doMatch) {
                                const uid = user.dataValues.userId
                                req.session.isLoggedIn = true;
                                req.session.user = user.dataValues;
                                req.session.userId = uid;
                                user.lastLogin = hlp.now();
                                user.save();

                                // ambil hak akses, karena ini hanya satu apps, bukan super apps, kita taruh hak akses sebagai modul saja.
                                const q1 = UserModule.vUserModule.findAll({ where: { userId: uid } });
                                const q2 = Departement.vUserDepartement.findAll({ where: { userId: uid } });
                                return Promise.all([q1, q2]);

                            }
                            req.flash('error', constant.MY_USERPASSNOTMATCHED);
                            req.flash('oldInput', { email: req.body.inputEmail });
                            return res.redirect('/login');
                        })
                        .then(result => {
                            req.session['departement'] = [];
                            req.session['departementId'] = [];
                            result[0].forEach(row => { req.session['pm_' + row.moduleName.toLowerCase()] = true; });
                            result[1].forEach(row => {
                                req.session['departement'].push(row.departement);
                                req.session['departementId'].push(row.departementId);
                            });

                            hlp.genAlert(req, { message: constant.MY_USERWELCOME + user.dataValues.fullname });
                            return res.redirect('/dashboard');
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
            res.redirect('/dashboard');
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
        const fullname = req.body.fullname;
        const email = req.body.email;
        const validationErrors = [];
        if (!validator.isEmail(email)) validationErrors.push('Please enter a valid email address.');
        if (validationErrors.length) {
            req.flash('error', 'E-Mail invalid, silahkan perbaiki');
            req.flash('oldInput', { fullname: fullname });
            return res.redirect('/sign-up');
        }
        const q0 = Modules.findOne({ raw: true, where: { moduleName: 'user' } });
        const q1 = User.vUser.findOne({ where: { email: email } })
        Promise.all([q0, q1])
            .then(result => {
                if (!result[1]) {
                    let data = {}
                    data.fullname = fullname ? fullname : 'user_' + hlp.randBetween(100, 999);
                    data.email = email;
                    bcrypt.hash(req.body.password, 12)
                        .then(hashed => {
                            data.password = hashed;
                            return User.tUser.create(data)
                        })
                        .then(newuser => {
                            return UserModule.tUserModule.create({ userId: newuser.userId, moduleId: result[0].moduleId })
                        })
                        .then(() => {
                            req.flash('success', 'User sudah dibuat, silahkan login dengan email dan password anda');
                            return res.redirect('/login');
                        })
                        .catch(err => { console.log(err) })
                } else {
                    req.flash('error', 'E-Mail sudah ada, pilih email yang lain.');
                    req.flash('oldInput', { fullname: fullname });
                    return res.redirect('/sign-up');
                }
            })
            .catch(err => console.log(err));
    }
    res.render('layouts/login_layout', { pages: '../pages/register', pageTitle: 'Register', errorMessage: message(req), oldInput: oldInput(req) });
};

exports.forgotPassword = (req, res, next) => {
    if (req.method == 'POST') {
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
            User.tUser.findOne({ where: { email: req.body.email } })
                .then(user => {
                    if (!user) {
                        req.flash('error', 'No user found with that email');
                        return res.redirect('/forgot-password');
                    }
                    user.resetToken = token;
                    user.resetTokenExpiry = Date.now() + 3600000;
                    user.password = hlp.md5(constant.MY_DEFAULTPASSWORD);
                    return user.save();
                }).then(result => {
                    req.flash('error', 'Password anda diganti ke password default: ' + constant.MY_DEFAULTPASSWORD);
                    return res.redirect('/login');
                }).catch(err => { console.log(err) })
        });
    } else {
        if (res.locals.isAuthenticated) {
            return res.redirect('/profile');
        } else {
            return res.render('layouts/login_layout', { pages: '../pages/forgot_password', pageTitle: 'Forgot Password', errorMessage: message(req), oldInput: oldInput(req) });
        }
    }
};

exports.changePassword = (req, res, next) => {

    if (req.method == 'POST') {
        User.tUser.findOne({ raw: true, where: { userId: req.body.userId } })
            .then(user => {
                if (user) {
                    bcrypt.hash(req.body.password1, 12)
                        .then(hashed => {
                            User.user_edit({ userId: req.body.userId, password: hashed })
                                .then(r => {
                                    hlp.genAlert(req, { message: constant.MY_USERPASSWORDCHANGED });
                                    return res.redirect('/logout');
                                })
                        });
                } else {
                    return res.redirect('/logout');
                }
            });
    } else {
        User.tUser.findOne({ raw: true, where: { userId: req.session.userId } })
            .then(result => {

                if (result) {
                    let vars = {
                        q_user: result,
                        pages: '../pages/login_changepassword',
                        pageTitle: 'Ganti Password'
                    };
                    res.render('layouts/login_layout', vars);
                } else {
                    hlp.genAlert(req, { tipe: 'error', message: constant.MY_USERDOESNOTEXISTS });
                    return res.redirect('/login');
                }


            });
    }
};


