const validator = require('validator');
const User = require('../../models/User');
const UserModule = require('../../models/UserModule');
const Modules = require('../../models/Modules');
const constant = require('../../../config/constant');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const hlp = require('../../helpers/helpers');





exports.profile = (req, res, next) => {   
    User.vUser.findOne({raw: true, where: {userId: req.session.userId}})
    .then(result => {   
        let vars = {
            q_user: result,
            pages: '../pages/profile',
            pageTitle: 'User Profile'
        };
        res.render('layouts/admin_layout', vars);

    });
  
};

exports.changePassword = (req, res, next) => {

    if (req.method == 'POST') {
        User.tUser.findOne({raw: true, where: {userId: req.body.userId}})
        .then(user => {    
            bcrypt.hash(req.body.password1, 12)
            .then(hashed=> {
                user.password = hashed;
                user.save;
                hlp.genAlert(req,{message: constant.MY_USERPASSWORDCHANGED});
                return res.redirect('/admin');
            });
        });
    } else {
        User.vUser.findOne({raw: true, where: {userId: req.session.userId}})
        .then(result => {    
            let breadcrumbs = {
                Home: '/admin',
                Profile: '/profile/'+req.session.userId,
                Password: '#'
            }
            if(result){
                let vars = {
                     q_user: result,
                     breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
                     pages: '../pages/profile_changepassword',
                     pageTitle: 'User Profile: Ganti Password'
                 };
                 res.render('layouts/admin_layout', vars); 
            } else {
                hlp.genAlert(req,{tipe:'error', message: constant.MY_USERDOESNOTEXISTS});
                return res.redirect('/admin');
            }
    

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
            defpassword  : hlp.md5(constant.MY_DEFAULTPASSWORD),
            breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
            menu_admin : true,
            pages: '../admin/user_list',
            pageTitle: 'User List',
        };
        res.render('layouts/admin_layout', vars);
    }); 
}

exports.add  =  (req, res, next) => {
    if (req.method=='POST') {
        const validationErrors = [];
        if (!validator.isEmail(req.body.email)) validationErrors.push('Please enter a valid email address.');
        if (validationErrors.length) {
            hlp.genAlert(req,{message:validationErrors});
            return res.redirect('/users-add');
        }
        User.vUser.findOne({where:{email: req.body.email}}).then(result =>{
            if(result) {
                req.flash('oldInput', { fullname: req.body.fullname, email: req.body.email });
                hlp.genAlert(req,{tipe:'error', message: constant.MY_USEREMAILISNOTUNIQUE});
                return res.redirect('/users-add');
            } else {
                User.user_add({email: req.body.email, fullname: req.body.fullname})
                .then(r => {
                    hlp.genAlert(req,{message:constant.MY_USERCREATED});
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
            breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
            menu_admin : true,
            pages: '../admin/user_form',
            pageTitle: 'Tambah User',
            oldInput: hlp.oldInput(req),
            q_user: false,
            edit: false

        };
        res.render('layouts/admin_layout', vars);

    }
}

exports.edit  =  (req, res, next) => {
    if (req.method=='POST') {
        User.vUser.findOne({where:{email: req.body.email}}).then(result =>{
            
        });
    } else {

        const u = User.vUser.findOne({where:{userid: req.params.userId}});
        const um = UserModule.userModule_get({userId:req.params.userId });
        const m = Modules.findAll();
        Promise.all([u, um, m])
        .then(result =>{
            if(result[0]) {
                let breadcrumbs = {
                    Home: '/admin',
                    Users: '/users',
                    Edit: '#'
                }   
            
                let vars = {
                    q_user: result[0],
                    q_usermodule: result[1],
                    q_module: result[2],
                    breadcrumbs : hlp.genBreadcrumbs(breadcrumbs),
                    menu_admin : true,
                    pages: '../admin/user_form',
                    pageTitle: 'Tambah User',
                    oldInput: hlp.oldInput(req),
                    edit: true,
                    userId: req.params.userId
                };
                res.render('layouts/admin_layout', vars); 
            } else {
                hlp.genAlert(req,{tipe:'error',message:constant.MY_USERDOESNOTEXISTS});
                return res.redirect('/users');
            }
        });
    }
}

exports.delete = (req, res, next) => {
   
    User.tUser.destroy({where: {userId: req.params.userId}})
    .then(result => {
        hlp.genAlert(req,{tipe: 'error',message:constant.MY_DATADELETE});
        return res.redirect('/users');
    })
    
};

exports.moduleAdd = (req, res, next) => {
   UserModule.userModule_delete({userId: req.body.f2uid, moduleId: req.body['f2module_list[]']})
   .then(r => {
        let ModuleIds = Array.isArray(req.body['f2module_list[]']) ? req.body['f2module_list[]'] : [req.body['f2module_list[]']];
        let params = [];
        console.log(ModuleIds);
        ModuleIds.forEach(key => {
            params.push({userId: req.body.f2uid, moduleId: key})        
        });
        console.log(params)
        UserModule.tUserModule.bulkCreate(params)
        .then(r => {
            return res.redirect('back');
        })
    })
   
};

exports.moduleDelete = (req, res, next) => {
   UserModule.userModule_delete({id: req.params.id})
   .then(r => {
       hlp.genAlert(req,{tipe: 'error',message:constant.MY_DATADELETE});
       return res.redirect('back');
   });
};

exports.passwordReset = (req, res, next) => {
    let defpassword = hlp.md5(constant.MY_DEFAULTPASSWORD);
    // kita pakai md5 supaya bisa dibaca apakah di user List terdeteksi sebagai default password atau belum    
    User.user_edit({password: defpassword, userId: req.params.userId})
    .then(r => {
        hlp.genAlert(req,{tipe: 'error',message:constant.MY_USERPASSWORDCHANGED});
        return res.redirect('back');
    });
 };