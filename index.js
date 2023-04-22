const path = require('path');
// load dependencies
const env = require('dotenv');
const csrf = require('csurf');
const express = require('express');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressHbs = require('express-handlebars');
const SequelizeStore = require("connect-session-sequelize")(session.Store); // initalize sequelize with session store
const fs = require('fs');
const hlp = require('./app/helpers/helpers');



const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('./config/certificate/key.pem', 'utf8');
const certificate = fs.readFileSync('./config/certificate/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})


const app = express();
const csrfProtection = csrf();
const router = express.Router();


//Loading Routes
const webRoutes = require('./routes/web');
const sequelize = require('./config/database');
const PageController = require('./app/controllers/PageController');

const constant = require('./config/constant');


env.config();
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



// required for csurf
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: parseInt(process.env.SESSION_MAXAGE) || 1209600000 }, // two weeks in milliseconds
    store: new SequelizeStore({
        db: sequelize,
        table: "sessions",
    }),
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.session = req.session;
    res.locals.env_sitetitle = process.env.SITETITLE;
    res.locals.env_sitefooter = process.env.SITEFOOTER;
    res.locals.alert = req.flash('alert');
    res.locals.canRegister = constant.MY_SITECANREGISTER;
    res.locals.constant = {};
    // constant disimpan di locals supaya bisa dipakai di views
    Object.keys(constant).forEach(function (key) {
        res.locals.constant[key] = constant[key]
    });
    res.locals.hlp = hlp;
    res.locals.uploadPath = path.join(__dirname, 'public/upload');

    res.locals.public = path.join(__dirname, 'public');


    next();
});

// Block access to the meeting directory
app.use('/public/upload', (req, res, next) => {
    res.status(404).send('File not found');
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(webRoutes);
app.use(PageController.pageNotFound);


const dbinit = require('./db/init');

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT, () => {
    console.log('HTTP Server running on port ' + process.env.PORT);
});

httpsServer.listen(process.env.HTTPSPORT, () => {
    console.log('HTTPS Server running on port ' + process.env.HTTPSPORT);
});
