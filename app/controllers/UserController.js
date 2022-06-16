const validator = require('validator');
const User = require('../models/User');
const UserModule = require('../models/UserModule');
const Module = require('../models/Module');

exports.profile = (req, res, next) => {

    console.log(req);
    User.User.findOne({ raw: true, where: { userId: req.session.userId } }).then(result => {
        res.locals.q_user = result;
        res.render('profile');
    });
};