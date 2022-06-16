const constant = require('../../config/constant');
const toastr = require('../helpers/toastr');

module.exports = (req, res, next) => {
    if (!constant.MY_SITECANREGISTER) {
        req.flash('alert', toastr({ tipe: 'error', message: constant.MY_CANNOTREGISTER }));
        return res.redirect('/login');
    }
    next();
}