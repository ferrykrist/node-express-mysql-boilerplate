const UserModule = require('../models/UserModule');
const User = require('../models/User');



// exports.sample = (req, res, next) => {
//     var localvar = "helloooo";
//     // jika ada beberapa proses ambil data dari beberapa model, maka harus dibuat nested karena sifat JS yang async, atau ambil dari ajax
//     let vars = {
//         opt_select: ['moduleId', 'moduleName'],
//         userId: 1
//     }
//     let vars2 = {
//         attribute: ['moduleId', 'moduleName'],
//         where: { 'userId': 1 },
//         raw: true
//     }
//     const um1 = UserModule.userModuleGet({ opt_select: ["moduleId", "moduleName"], userId: 1 });
//     const um2 = UserModule.userModuleGet(vars);
//     const um3 = UserModule.UserModule.findAll({ raw: true, attribute: ["moduleId", "moduleName"], where: { "userId": 1 } });
//     const um4 = UserModule.UserModule.findAll(vars2);


//     const u = User.userGet({});
//     Promise.all([um1, um4, u, um3, u]).then(result => {
//         console.log(res.locals.session);
//         res.locals.q_usermodule = result[0];
//         res.locals.q_usermodule2 = result[1];
//         res.locals.q_users = result[2];
//         let vars = {
//             layout: 'test',
//             pageTitle: 'test'
//         };
//         res.render('admin/user_manager', vars);
//     });
// };