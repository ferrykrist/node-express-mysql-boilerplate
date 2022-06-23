//
const User = require('../app/models/User');
const Session = require('../app/models/Session');
const UserModule = require('../app/models/UserModule');
const Modules = require('../app/models/Modules');

User.tUser.sync();
Session.sync();
UserModule.tUserModule.sync();
Modules.sync();