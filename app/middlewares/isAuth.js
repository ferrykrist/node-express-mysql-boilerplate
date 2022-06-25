const hlp = require('../helpers/helpers');
const constant = require('../../config/constant');

module.exports = (param = '/') => {
    return (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect(param);
        }
        next();
    }
}