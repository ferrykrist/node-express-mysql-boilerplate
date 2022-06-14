const hbs = require('express-handlebars');

hbs.registerHelper('helper_name', function (options) { return 'helper value'; });