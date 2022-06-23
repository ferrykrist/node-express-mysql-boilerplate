const validator = require('validator');
const User = require('../../models/User');
const UserModule = require('../../models/UserModule');
const Modules = require('../../models/Modules');
const constant = require('../../../config/constant');
const bcrypt = require('bcryptjs');
const hlp = require('../../helpers/helpers');




exports.profile = (req, res, next) => {

    if (req.method == 'POST') {

    } else {
        User.vUser.findOne({raw: true, where: {userId: req.params.userId}})
        .then(result => {    
    
            let vars = {
                q_user: result,
                pages: '../pages/profile',
                pageTitle: 'User Profile'
            };
            res.render('layouts/admin_layout', vars);

        });
    }
};

exports.list =  (req, res, next) => {
    User.user_get({})
    .then(result => {

        let breadcrumbs = {
            Home: '/admin',
            Users: '#'
        }

        let vars = {
            q_user : result,
            breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
            menu_admin : true,
            pages: '../admin/user_list',
            pageTitle: 'User List',
        };
        res.render('layouts/admin_layout', vars);
    }); 
}

exports.add  =  (req, res, next) => {
    let breadcrumbs = {
        Home: '/admin',
        Users: '/users',
        Add: '#'
    }

    let vars = {
        breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
        menu_admin : true,
        pages: '../admin/user_form',
        pageTitle: 'Tambah User'
    };
    res.render('layouts/admin_layout', vars);
}

exports.delete = (req, res, next) => {
   
    User.tUser.destroy({where: {userId: req.params.userId}})
    .then(result => {
        req.flash('alert', hlp.genAlert(req,{tipe: 'error',message:constant.MY_DATADELETE}) );
        return res.redirect('/users');
    })
    
};