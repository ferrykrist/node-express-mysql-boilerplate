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


const http = require('http');
const https = require('https');
const privateKey = fs.readFileSync('./config/certificate/key.pem', 'utf8');
const certificate = fs.readFileSync('./config/certificate/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();
const csrfProtection = csrf();
const router = express.Router();


//Loading Routes
const webRoutes = require('./routes/web');
const sequelize = require('./config/database');
const errorController = require('./app/controllers/ErrorController');

env.config();
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// required for csurf
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
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
    next();
});


// app.use(function (request, response, next) {
//     if (process.env.NODE_ENV != 'development' && !request.secure) {
//         return response.redirect(301, 'https://' + process.env.BASEURL);
//         //return response.redirect("https://" + request.headers.host + request.url);
//     }
//     next();
// });

app.engine(
    'hbs',
    expressHbs({
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/',
        defaultLayout: 'web_layout',
        extname: 'hbs'
    })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(webRoutes);
app.use(errorController.pageNotFound);



// kita matikan auto sync all - nya sequalize, sebagai gantinya kita pakai db/init.js untuk memanggil menjalankan sync per model
// tujuannya kalau nanti kita menggunakan VIEW, kita bisa langsung panggil lewat model tapi tidak perlu melewati proses sync-pembuatan tabel di database
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


//sequelize
//.sync({ force: true })
// .sync()
//.then(() => {
// app.listen(process.env.PORT);
//pending set timezone
// console.log("App listening on port " + process.env.PORT);
    //})
    //.catch(err => {
    //    console.log(err);
    //});
