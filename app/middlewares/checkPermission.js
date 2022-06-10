async function checkPermission(req, res, next) {
    var result = false;
    if (!req.session.isLoggedIn) {
    }
    return result;
    next();
}

module.exports = { checkpermission };