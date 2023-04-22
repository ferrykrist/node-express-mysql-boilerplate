const constant = require('../../config/constant');
const helpers = require('../helpers/helpers');

module.exports = (req, res, next) => {
    return (req, res, next) => {
    if (!constant.MY_SITECANREGISTER) {
        req.flash('alert', hlp.toastr({ tipe: 'error', message: constant.MY_CANNOTREGISTER }));
        return res.redirect('/login');
    }
    next();
    }
}