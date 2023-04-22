
const hlp = require('../helpers/helpers');
const User = require('../models/User');
const Departement = require('../models/Departements');
const { Op } = require('sequelize');

exports.pageNotFound = (req, res, next) => {

    let vars = {
        pages: '../pages/404',
        pageTitle: ' Page not found'
    };
    res.render('layouts/blank_layout', vars);
};


exports.dashboard = (req, res, next) => {

    const departementId = { [Op.in]: req.session.departementId };
    const userId = req.session.userId;
    let vars = {
        q_user: req.session.user,
        pages: '../pages/dashboard',
        pageTitle: 'Dashboard'
    };
    if (req.session['pm_user']) {
        vars.pages = '../pages/dashboard';
        res.render('layouts/admin_layout', vars);
    }

    if (req.session['pm_superadmin']) {
        vars.pages = '../pages/dashboard_admin';
        res.render('layouts/admin_layout', vars);
        return;
    };

    if (req.session['pm_staff']) {
        vars.pages = '../pages/dashboard_manager';
        res.render('layouts/admin_layout', vars);
        return;
    }




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

exports.tentangkami = (req, res, next) => {
    let vars = {
        pages: '../pages/tentangkami',
        pageTitle: res.locals.env_sitetitle
    };
    res.render('layouts/frontpage_layout', vars);
}