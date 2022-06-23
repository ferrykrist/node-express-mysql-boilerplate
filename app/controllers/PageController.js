exports.pageNotFound = (req, res, next) => {

    let vars = {
        pages: '../pages/404',
        pageTitle: ' Page not found'
    };
    res.render('layouts/blank_layout', vars);
};

exports.adminPage = (req, res, next) => {

    let vars = {
        pages: '../pages/admin',
        pageTitle: 'test'
    };
    res.render('layouts/admin_layout', vars);
};

exports.frontPage = (req, res, next) => {

    let vars = {
        pages: '../pages/frontpage',
        pageTitle: res.locals.env_sitetitle
    };
    res.render('layouts/frontpage_layout', vars);
};

exports.debug = (req, res, next) => {

    let vars = {
        pages: '../pages/debug',
        pageTitle: 'debug',
        data: JSON.stringify({
            res_dot_locals: res.locals
        }, null, 4)
    };
    
    res.render('layouts/admin_layout', vars);
};