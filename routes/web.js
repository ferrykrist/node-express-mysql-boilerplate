const express = require('express');
const router = express.Router();
const PageController = require('../app/controllers/PageController');
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/admin/UserController');
const ModuleController = require('../app/controllers/admin/ModuleController');


const isAuth = require('../app/middlewares/isAuth');
const canRegister = require('../app/middlewares/canRegister');
const checkPermission = require('../app/middlewares/checkPermission');



// router.get('/', PageController.homePage);
router.get('/', PageController.frontPage);
router.get('/login', AuthController.login);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/sign-up', canRegister, AuthController.signUp);
router.post('/sign-up', canRegister, AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPassword);
router.post('/forgot-password', AuthController.forgotPassword);

router.get('/admin', isAuth, PageController.adminPage);

router.get('/profile/:userId', isAuth, UserController.profile);

// admin
router.get('/users', isAuth, checkPermission('pm_admin'), UserController.list);
router.get('/users-add', isAuth, checkPermission('pm_admin'), UserController.add);
router.get('/users-delete/:userId', isAuth, checkPermission('pm_admin'), UserController.delete);
// router.get('/users-edit/:userId', isAuth, checkPermission('pm_admin'), UserController.edit);



router.get('/debug', isAuth, checkPermission('pm_admin'), PageController.debug);
router.get('/modules', isAuth, checkPermission('pm_admin'), ModuleController.list);
router.post('/modules-add', isAuth, checkPermission('pm_admin'), ModuleController.add);
router.get('/modules-delete/:moduleId', isAuth, checkPermission('pm_admin'), ModuleController.delete);








module.exports = router;