//
const User = require('../app/models/User');
const Session = require('../app/models/Session');
const UserModule = require('../app/models/UserModule');
const Module = require('../app/models/Module');

User.UserRaw.sync();
Session.sync();
UserModule.UserModuleRaw.sync();
Module.sync();