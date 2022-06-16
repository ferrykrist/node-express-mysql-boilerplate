const Handlebars = require('handlebars');
const checkPermission = require('../middlewares/checkPermission');

// ini sample dari web handlebars
Handlebars.registerHelper('loud', function (aString) {
    return '<strong>' + aString + '</strong>';
})
