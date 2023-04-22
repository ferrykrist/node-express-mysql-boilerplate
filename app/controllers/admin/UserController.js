const validator = require('validator');
const User = require('../../models/User');
const UserModule = require('../../models/UserModule');
const Departement = require('../../models/Departements');
const Modules = require('../../models/Modules');
const constant = require('../../../config/constant');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const hlp = require('../../helpers/helpers');





exports.profile = (req, res, next) => {
    User.vUser.findOne({ raw: true, where: { userId: req.session.userId } })
        .then(result => {
            let vars = {
                q_user: result,
                pages: '../pages/profile',
                pageTitle: 'Profil'
            };
            res.render('layouts/admin_layout', vars);

        });

};

exports.changePassword = (req, res, next) => {

    if (req.method == 'POST') {
        User.tUser.findOne({ raw: true, where: { userId: req.body.userId } })
            .then(user => {
                bcrypt.hash(req.body.password1, 12)
                    .then(hashed => {
                        user.password = hashed;
                        user.save;
                        hlp.genAlert(req, { message: constant.MY_USERPASSWORDCHANGED });
                        return res.redirect('/admin');
                    });
            });
    } else {
        User.vUser.findOne({ raw: true, where: { userId: req.session.userId } })
            .then(result => {
                let breadcrumbs = {
                    Home: '/admin',
                    Profile: '/profile/' + req.session.userId,
                    Password: '#'
                }
                if (result) {
                    let vars = {
                        q_user: result,
                        breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
                        pages: '../pages/profile_changepassword',
                        pageTitle: 'Ganti Password'
                    };
                    res.render('layouts/admin_layout', vars);
                } else {
                    hlp.genAlert(req, { tipe: 'error', message: constant.MY_USERDOESNOTEXISTS });
                    return res.redirect('/admin');
                }


            });
    }
};

exports.list = (req, res, next) => {

    User.vUser.findAll({ raw: true })
        .then(result => {
            let breadcrumbs = {
                Home: '/admin',
                Users: '#'
            }
            let vars = {
                q_user: result,
                superadmin: true,
                defpassword: hlp.md5(constant.MY_DEFAULTPASSWORD),
                breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
                menu_admin: true,
                pages: '../admin/user_list',
                pageTitle: 'Daftar User',
            };
            res.render('layouts/admin_layout', vars);
        });
}

exports.add = (req, res, next) => {
    if (req.method == 'POST') {
        const fullname = req.body.fullname;
        const email = req.body.email;
        const validationErrors = [];
        if (!validator.isEmail(email)) validationErrors.push('Please enter a valid email address.');
        if (validationErrors.length) {
            hlp.genAlert(req, { message: validationErrors });
            return res.redirect('/users/add');
        }
        const q1 = Modules.findOne({ raw: true, where: { moduleName: 'user' } });
        const q2 = User.vUser.findOne({ where: { email: email } });
        Promise.all([q1, q2])
            .then(result => {
                if (result[1]) {
                    req.flash('oldInput', { fullname: fullname, email: email });
                    hlp.genAlert(req, { tipe: 'error', message: constant.MY_USEREMAILISNOTUNIQUE });
                    return res.redirect('/users/add');
                } else {
                    let data = {}
                    data.password = hlp.md5(constant.MY_DEFAULTPASSWORD);
                    data.fullname = fullname ? fullname : 'user_' + hlp.randBetween(100, 999);
                    data.email = email;
                    User.tUser.create(data)
                        .then(newuser => {
                            return UserModule.tUserModule.create({ userId: newuser.userId, moduleId: result[0].moduleId })
                        })
                        .then(() => {
                            hlp.genAlert(req, { message: constant.MY_USERCREATED });
                            return res.redirect('/users');
                        })
                }
            });
    } else {
        let breadcrumbs = {
            Home: '/admin',
            Users: '/users',
            Add: '#'
        }

        let vars = {
            breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
            menu_admin: true,
            pages: '../admin/user_form',
            pageTitle: 'Tambah User',
            oldInput: hlp.oldInput(req),
            q_user: false,
            edit: false

        };
        res.render('layouts/admin_layout', vars);

    }
}

exports.edit = (req, res, next) => {
    if (req.method == 'POST') {
        User.tUser.findOne({ where: { userId: req.body.userId } }).then(result => {
            result.fullname = req.body.fullname;
            result.email = req.body.email;
            result.save();
            hlp.genAlert(req, { message: constant.MY_DATAEDITED });
            return res.redirect('/users');

        });
    } else {
        const userId = req.params.userId;
        const q1 = User.vUser.findOne({ where: { userid: userId } });
        const q2 = UserModule.vUserModule.findAll({ raw: true, where: { userId: userId } });
        const q3 = Modules.findAll({ raw: true });
        const q4 = Departement.tDepartement.findAll({ raw: true });
        const q5 = Departement.vUserDepartement.findAll({ raw: true, where: { userId: userId } });
        Promise.all([q1, q2, q3, q4, q5])
            .then(result => {
                if (result[0]) {
                    let breadcrumbs = {
                        Home: '/admin',
                        Users: '/users',
                        Edit: '#'
                    }

                    let vars = {
                        q_user: result[0],
                        q_usermodule: result[1],
                        q_module: result[2],
                        q_departement: result[3],
                        q_userdepartement: result[4],
                        breadcrumbs: hlp.genBreadcrumbs(breadcrumbs),
                        menu_admin: true,
                        pages: '../admin/user_form',
                        pageTitle: 'Edit User',
                        oldInput: hlp.oldInput(req),
                        edit: true,
                        userId: userId
                    };
                    res.render('layouts/admin_layout', vars);
                } else {
                    hlp.genAlert(req, { tipe: 'error', message: constant.MY_USERDOESNOTEXISTS });
                    return res.redirect('/users');
                }
            });
    }
}

exports.delete = (req, res, next) => {

    User.tUser.destroy({ where: { userId: req.body.userId } })
        .then(result => {
            hlp.genAlert(req, { tipe: 'error', message: constant.MY_DATADELETE });
            return res.redirect('/users');
        })

};

exports.userModule_get = (req, res, next) => {
    UserModule.vUserModule.findAll({ raw: true, where: { moduleId: req.body.moduleId } })
        .then(result => {
            res.status(200).send(JSON.stringify(result));
        })
        .catch((err) => {
            return res.status(400).send(err.message);
        });

};

exports.userModule_add = (req, res, next) => {
    const userId = req.body.userId;
    const moduleId = req.body.moduleId;
    UserModule.tUserModule.destroy({ where: { userId: userId, moduleId: moduleId } })
        .then(r => {
            let params = [];
            UserModule.tUserModule.create({ userId: userId, moduleId: moduleId })
                .then(r => {
                    return res.redirect('back');
                })
        })
};

exports.userModule_add2 = (req, res, next) => {
    const userIds = Array.isArray(req.body['userId[]']) ? req.body['userId[]'] : [req.body['userId[]']];
    const moduleId = req.body.moduleId;

    UserModule.tUserModule.destroy({ where: { moduleId: moduleId, userId: userIds } })
        .then(r => {
            let params = [];
            userIds.forEach(key => {
                params.push({ moduleId: moduleId, userId: key })
            });
            UserModule.tUserModule.bulkCreate(params)
                .then(r => {
                    return res.redirect('back');
                })
        })
};

exports.userModule_delete = (req, res, next) => {
    UserModule.tUserModule.destroy({ where: { id: req.params.id } })
        .then(r => {
            hlp.genAlert(req, { tipe: 'error', message: constant.MY_DATADELETE });
            return res.redirect('back');
        });
};


exports.userDepartement_get = (req, res, next) => {
    Departement.vUserDepartement.findAll({ raw: true, where: { departementId: req.body.departementId } })
        .then(result => {
            res.status(200).send(JSON.stringify(result));
        })
        .catch((err) => {
            return res.status(400).send(err.message);
        });
};

exports.userDepartement_add = (req, res, next) => {
    const userId = req.body.userId;
    const departementId = req.body.departementId;
    Departement.tUserDepartement.destroy({ where: { userId: userId, departementId: departementId } })
        .then(r => {
            Departement.tUserDepartement.create({ userId: userId, departementId: departementId })
                .then(r => {
                    return res.status(200).redirect('back');
                })
        })
};

exports.userDepartement_add2 = (req, res, next) => {
    const userIds = Array.isArray(req.body['userId[]']) ? req.body['userId[]'] : [req.body['userId[]']];
    const departementId = req.body.departementId;

    Departement.tUserDepartement.destroy({ where: { departementId: departementId, userId: userIds } })
        .then(r => {
            let params = [];
            userIds.forEach(key => {
                params.push({ departementId: departementId, userId: key })
            });
            Departement.tUserDepartement.bulkCreate(params)
                .then(r => {
                    return res.redirect('back');
                })
        })
};

exports.userDepartement_delete = (req, res, next) => {
    Departement.tUserDepartement.destroy({ where: { id: req.params.id } })
        .then(r => {
            hlp.genAlert(req, { tipe: 'error', message: constant.MY_DATADELETE });
            return res.redirect('back');
        });
};

exports.passwordReset = (req, res, next) => {
    let defpassword = hlp.md5(constant.MY_DEFAULTPASSWORD);
    // kita pakai md5 supaya bisa dibaca apakah di user List terdeteksi sebagai default password atau belum    
    User.user_edit({ password: defpassword, userId: req.params.userId })
        .then(r => {
            hlp.genAlert(req, { tipe: 'error', message: constant.MY_USERPASSWORDCHANGED });
            return res.redirect('back');
        });
};
