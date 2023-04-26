//
const User = require('../app/models/User');
const Session = require('../app/models/Session');
const UserModule = require('../app/models/UserModule');
const Departement = require('../app/models/Departements');
const Modules = require('../app/models/Modules');

User.tUser.sync();
Departement.tDepartement.sync();
Departement.tUserDepartement.sync();
Session.sync();
UserModule.tUserModule.sync();
Modules.sync();
