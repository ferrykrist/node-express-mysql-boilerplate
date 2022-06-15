const UserModule = require('../models/UserModule');
const User = require('../models/User');
const checkPermission = require('../middlewares/checkPermission');



exports.homePage = (req, res, next) => {
    var localvar = "helloooo";
    // jika ada beberapa proses ambil data dari beberapa model, maka harus dibuat nested karena sifat JS yang async, atau ambil dari ajax
    UserModule.userModuleGet({ opt_select: ["moduleId", "moduleName"], userId: req.session.userId })
        .then(data => { res.locals.q_usermodule = data; })
        .then(
            UserModule.userModuleGet({ opt_select: ["moduleId", "moduleName"], userId: 2 })
                .then(data => { res.locals.q_usermodule2 = data; })
                .then(
                    User.userGet({ userId: 2 })
                        .then(data => {
                            res.locals.q_users = data;
                        })
                        .then((e) => {
                            res.locals.usermodule = req.session.userModule;
                            let vars = {
                                layout: 'test',
                                pageTitle: 'test'
                            };
                            // res.render('home', data);
                            res.render('admin/user_manager', vars)
                        })
                )
        );

    // local = {
    //     person: {
    //         firstname: "Ferry",
    //         lastname: "Katz",
    //     }
    // }
    // console.log(local);
    //console.log(res);
};