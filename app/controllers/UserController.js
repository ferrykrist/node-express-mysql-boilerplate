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
    User.user_add({ email: '1@1.com' });
    User.vUser.findOne({ raw: true, where: { userId: req.session.userId } }).then(result => {

        res.locals.q_user = result;

        let vars = {
            layout: 'admin_layout',
            pageTitle: 'User Profile'
        };
        res.render('profile', vars);
    });



};