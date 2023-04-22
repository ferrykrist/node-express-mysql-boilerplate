const express = require('express');
const path = require('path');
const router = express.Router();
const sseExpress = require('sse-express');
const crypto = require('crypto');


const constant = require('../config/constant');


const PageController = require('../app/controllers/PageController');
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/admin/UserController');
const ModuleController = require('../app/controllers/admin/ModuleController');
const DepartementController = require('../app/controllers/admin/DepartementController');


const isAuth = require('../app/middlewares/isAuth');
const canRegister = require('../app/middlewares/canRegister');
const checkSession = require('../app/middlewares/checkSession');

// untuk windows mungkin perlu disesuaikan tanda "/" atau "\"
// const uploadPath = path.join(__dirname, '../public/upload');

// const path = path.join(__dirname, '../public/upload');


const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const meetingId = req.body.meetingId;
        const uploadPath = `public/meeting/meeting_${meetingId}/`
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(4, function (err, buf) {
            if (err) {
                return cb(err);
            }
            const randomFilename = buf.toString('hex') + '-' + file.originalname;
            cb(null, randomFilename);
        });
    }
});

const upload = multer({ storage: storage });

// router.get('/', PageController.homePage);
router.get('/', PageController.frontPage);
router.get('/login', AuthController.login);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/sign-up', canRegister(), AuthController.signUp);
router.post('/sign-up', canRegister(), AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);
// ganti password default
router.get('/login-changepassword', isAuth('/login'), AuthController.changePassword);
router.post('/login-changepassword', isAuth('/login'), AuthController.changePassword);

router.get('/admin', isAuth(), PageController.dashboard);
router.get('/dashboard', isAuth(), PageController.dashboard);

router.get('/debug', isAuth(), checkSession('pm_superadmin'), PageController.debug);

router.get('/profile', isAuth(), UserController.profile);
router.get('/profile/changepassword', isAuth(), UserController.changePassword);
router.post('/profile/changepassword', isAuth(), UserController.changePassword);

// admin
router.get('/users', isAuth(), checkSession('pm_superadmin'), UserController.list);
router.get('/users/add', isAuth(), checkSession('pm_superadmin'), UserController.add);
router.post('/users/add', isAuth(), checkSession('pm_superadmin'), UserController.add);

router.post('/users/delete', isAuth(), checkSession('pm_superadmin'), UserController.delete);
router.get('/users/edit/:userId', isAuth(), checkSession('pm_superadmin'), UserController.edit);
router.post('/users/edit/:userId', isAuth(), checkSession('pm_superadmin'), UserController.edit);

router.post('/users/module', isAuth(), checkSession('pm_superadmin'), UserController.userModule_get);
router.post('/users/module/add', isAuth(), checkSession('pm_superadmin'), UserController.userModule_add);
router.post('/users/module/add2', isAuth(), checkSession('pm_superadmin'), UserController.userModule_add2);
router.get('/users/module/delete/:id', isAuth(), checkSession('pm_superadmin'), UserController.userModule_delete);
router.post('/users/departement', isAuth(), checkSession('pm_superadmin'), UserController.userDepartement_get);
router.post('/users/departement/add', isAuth(), checkSession('pm_superadmin'), UserController.userDepartement_add);
router.post('/users/departement/add2', isAuth(), checkSession('pm_superadmin'), UserController.userDepartement_add2);
router.get('/users/departement/delete/:id', isAuth(), checkSession('pm_superadmin'), UserController.userDepartement_delete);
router.get('/users/reset/:userId', isAuth(), checkSession('pm_superadmin'), UserController.passwordReset);


router.get('/hakakses', isAuth(), checkSession('pm_superadmin'), ModuleController.list);
//router.post('/modules-add', isAuth(), checkSession('pm_superadmin'), ModuleController.add);
router.get('/hakakses/delete/:userId/:moduleId', isAuth(), checkSession('pm_superadmin'), ModuleController.delete);

router.get('/departement', isAuth(), checkSession('pm_superadmin'), DepartementController.list);
router.post('/departement/add', isAuth(), checkSession('pm_superadmin'), DepartementController.add);
router.post('/departement/edit/:departementId', isAuth(), checkSession('pm_superadmin'), DepartementController.add);
router.get('/departement/delete/:departementId', isAuth(), checkSession('pm_superadmin'), DepartementController.delete);






module.exports = router;    