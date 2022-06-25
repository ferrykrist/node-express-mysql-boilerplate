const validator = require('validator');
const User = require('../../models/User');
const UserModule = require('../../models/UserModule');
const Modules = require('../../models/Modules');
const constant = require('../../../config/constant');
const bcrypt = require('bcryptjs');
const hlp = require('../../helpers/helpers');

exports.list = (req, res, next) => {
    let breadcrumbs = {
        Home: '/admin',
        Modules: '#'
    }

    
    Modules.findAll({raw: true})
    .then(result => {  

        let vars = {
            q_module: result,
            breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
            menu_admin: true,
            pages: '../admin/module_list',
            pageTitle: 'Daftar Modul'
        };
        res.render('layouts/admin_layout', vars);
    });
    
};

exports.add = (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.moduleName)) validationErrors.push('Nama modul tidak boleh kosong');
    if (validationErrors.length) {
        hlp.genAlert(req,{tipe: 'error',message:validationErrors});
        return res.redirect('/modules');
    }
    Modules.create({moduleName: req.body.moduleName})
    .then(result=> {
        hlp.genAlert(req,{message:constant.MY_DATAINSERT});
        return res.redirect('/modules');
    })

};

exports.delete = (req, res, next) => {
   
    Modules.destroy({where: {moduleId: req.params.moduleId}})
    .then(result => {
        hlp.genAlert(req,{tipe: 'error',message:constant.MY_DATADELETE});
        return res.redirect('/modules');
    })
    
};