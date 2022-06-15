module.exports = (req, res, next, param) => {
    var result = false;
    if (req.session.isLoggedIn) {
        let modules = req.session.userModule;
        //console.log(modules);
        result = modules.find(x => x.moduleName == param) ? true : false;
    }
    return result;
    next();
}