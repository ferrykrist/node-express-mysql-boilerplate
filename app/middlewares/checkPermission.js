async function checkPermission(req, res, next) {
    var result = false;
    if (!req.session.isLoggedIn) {

    } else {

    }
    return result;
    next();
}

module.exports = { checkpermission };