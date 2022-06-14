const UserModule = require('../models/UserModule');

exports.homePage = (req, res, next) => {
    var localvar = "helloooo";
    // jika ada beberapa proses ambil data dari beberapa model, maka harus dibuat nested karena sifat JS yang async, atau ambil dari ajax
    UserModule.userModuleGet({ opt_select: ["moduleID", "moduleName"], opt_orderby: ['moduleName'], local: localvar }).then(data => {
        console.log(data.result);
        console.log(data);

        // let local = req.session.mydata;
        // local = {
        //     person: {
        //         firstname: "Ferry",
        //         lastname: "Katz",
        //     }
        // }
        // console.log(local);
        let data2 = {
            person: {
                firstname: "Yehuda",
                lastname: "Katz",
            }
        }
        let vars = {
            layout: 'test',
            pageTitle: 'test',
            data: data2
        };
        // res.render('home', data);
        res.render('admin/user_manager', vars)

    });
};