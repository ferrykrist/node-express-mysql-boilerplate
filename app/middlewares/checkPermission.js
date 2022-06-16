const constant = require('../../config/constant');

module.exports = (param) => {
    return (req, res, next) => {
        let result = false;
        if (!req.session[param]) {
            req.flash = alert({ tipe: 'danger', message: constant.MY_NOAKSES });
            return res.redirect('/');
        }
        next();
    }
}