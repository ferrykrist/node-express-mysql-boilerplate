const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const toastr = require('../helpers/toastr');
const hlp = require('../helpers/helpers');

const constant = require('../../config/constant');

const User = require('../models/User');
const Session = require('../models/Session');
const UserModule = require('../models/UserModule');
const Module = require('../models/Module');
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
        oldInput = null;
    }

    return oldInput;
}

exports.loginPage = (req, res, next) => {
    if (res.locals.isAuthenticated) {
        res.redirect('/');
    } else {
        res.render('login', { layout: 'login_layout', pageTitle: 'Login', errorMessage: message(req), oldInput: oldInput(req) });
    }
};

exports.login = (req, res, next) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.inputEmail)) validationErrors.push('Please enter a valid email address.');
    if (validator.isEmpty(req.body.inputPassword)) validationErrors.push('Password cannot be blank.');
    if (validationErrors.length) {
        req.flash('error', validationErrors);
        return res.redirect('/login');
    }
    User.vUser.findOne({
        where: {
            email: req.body.inputEmail
        }
    }).then(user => {
        if (user) {
            bcrypt
                .compare(req.body.inputPassword, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        let uid = user.dataValues.userId
                        req.session.isLoggedIn = true;
                        req.session.user = user.dataValues;
                        req.session.userId = uid;

                        // ambil hak akses
                        // UserModule.userModuleGet({ opt_select: ["moduleName"], userId: req.session.userId }).then(data => {
                        //     data.forEach(e => {
                        //         req.session['pm_' + e.moduleName.toLowerCase()] = true;
                        //     })
                        // });

                        hlp.genAlert(req, { message: constant.MY_USERWELCOME + user.dataValues.fullname });


                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password.');
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
            req.flash('error', 'No user found with this email');
            req.flash('oldInput', { email: req.body.inputEmail });
            return res.redirect('/login');
        }
    })
        .catch(err => console.log(err));
};

exports.logout = (req, res, next) => {
    if (res.locals.isAuthenticated) {
        req.session.destroy(err => {
            return res.redirect('/login');
        });
    } else {
        return res.redirect('/login');
    }
};

exports.signUpPage = (req, res, next) => {
    res.render('sign_up', { layout: 'login_layout', errorMessage: message(req), oldInput: oldInput(req) });
};

exports.signUp = (req, res, next) => {
    User.vUser.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (!user) {
            return bcrypt
                .hash(req.body.password, 12)
                .then(hashedPassword => {
                    const user = new User.tUser({
                        fullname: req.body.name,
                        email: req.body.email,
                        password: hashedPassword,
                    });
                    return user.save();
                })
                .then(result => {
                    return res.redirect('/login');
                });
        } else {
            req.flash('error', 'E-Mail exists already, please pick a different one.');
            req.flash('oldInput', { name: req.body.name });
            return res.redirect('/sign-up');
        }
    })
        .catch(err => console.log(err));
};

exports.forgotPasswordPage = (req, res, next) => {
    if (res.locals.isAuthenticated) {
        return res.redirect('/');
    } else {
        return res.render('forgot_password', { layout: 'login_layout', loginPage: true, pageTitle: 'Forgot Password', errorMessage: message(req), oldInput: oldInput(req) });
    }
};

exports.forgotPassword = (req, res, next) => {
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
};