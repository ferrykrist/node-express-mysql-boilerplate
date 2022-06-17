const toastr = require('./toastr');
exports.ObjNotEmpty = (obj) => {
    return Object.keys(obj).length > 0 ? true : false;
}

exports.genAlert = (req, vars) => {
    req.flash('alert', toastr(vars));
}