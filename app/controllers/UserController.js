const validator = require('validator');
const User = require('../models/User');
const UserModule = require('../models/UserModule');
const Module = require('../models/Module');
const constant = require('../../config/constant');
const bcrypt = require('bcryptjs');
const hlp = require('../helpers/helpers');




exports.profile = (req, res, next) => {

    if (req.method == 'POST') {

    }
    bcrypt.hash('password', 12).then(hashed => {
        User.user_add({ fullname: 'Ferry 3', email: '1@1.com', password: hashed })
            .then(e => {
                console.log(constant.MY_USERCREATED);
            })
            .finally(() => {
                User.vUser.findOne({ raw: true, where: { userId: req.session.userId } }).then(result => {

                    res.locals.q_user = result;
                    res.render('profile');
                });
            })

    })



};