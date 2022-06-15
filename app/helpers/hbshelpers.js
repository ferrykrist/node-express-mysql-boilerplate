const Handlebars = require('handlebars');
const checkPermission = require('../middlewares/checkPermission');


Handlebars.registerHelper('loud', function (aString) {
    return '<strong>' + aString + '</strong>';
})
