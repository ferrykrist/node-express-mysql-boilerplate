const validator = require('validator');
const User = require('../../models/User');
const Departement = require('../../models/Departements');
const constant = require('../../../config/constant');
const hlp = require('../../helpers/helpers');

exports.list = (req, res, next) => {
    let breadcrumbs = {
        Home: '/admin',
        Modules: '#'
    }
    const q1 = Departement.vDepartement.findAll({ raw: true });
    const q2 = User.tUser.findAll({ raw: true });
    Promise.all([q1, q2])
        .then(result => {
            let vars = {
                q_departement: result[0],
                q_user: result[1],
                breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
                menu_admin: true,
                pages: '../admin/departement_list',
                pageTitle: 'Daftar Departemen'
            };
            res.render('layouts/admin_layout', vars);
        });

};

exports.add = (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.departement)) validationErrors.push('Nama Departemen tidak boleh kosong');
    if (validationErrors.length) {
        hlp.genAlert(req, { tipe: 'error', message: validationErrors });
        return res.redirect('/departement');
    }
    Departement.tDepartement.create({ departement: req.body.departement })
        .then(() => {
            hlp.genAlert(req, { message: constant.MY_DATAINSERT });
            return res.redirect('/departement');
        });
};

exports.edit = (req, res, next) => {
    const validationErrors = [];
    if (validator.isEmpty(req.body.departement)) validationErrors.push('Nama Departemen tidak boleh kosong');
    if (validationErrors.length) {
        hlp.genAlert(req, { tipe: 'error', message: validationErrors });
        return res.redirect('/departement');
    }
    Departement.tDepartement.update({ departement: req.body.departement }, { where: { departementId: req.params.departementId } })
        .then(() => {
            hlp.genAlert(req, { message: constant.MY_DATAEDITED });
            return res.redirect('/departement');
        });
};

exports.delete = (req, res, next) => {
    Departement.tDepartement.destroy({ where: { departementId: req.params.departementId } })
        .then(result => {
            hlp.genAlert(req, { tipe: 'error', message: constant.MY_DATADELETE });
            return res.redirect('/departement');
        })

};