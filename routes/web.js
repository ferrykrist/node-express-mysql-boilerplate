const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const AuthController = require('../app/controllers/AuthController');
const UserController = require('../app/controllers/UserController');

const isAuth = require('../app/middlewares/isAuth');
const canRegister = require('../app/middlewares/canRegister');



// router.get('/', HomeController.homePage);
router.get('/', isAuth, HomeController.homePage);
router.get('/login', AuthController.loginPage);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/sign-up', canRegister, AuthController.signUpPage);
router.post('/sign-up', canRegister, AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post('/forgot-password', AuthController.forgotPassword);

router.get('/profile', isAuth, UserController.profile);



module.exports = router;