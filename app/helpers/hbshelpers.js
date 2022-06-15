const Handlebars = require('handlebars');
const checkPermission = require('../middlewares/checkPermission');


Handlebars.registerHelper('loud', function (aString) {
    return '<strong>' + aString + '</strong>';
})

Handlebars.registerHelper('checkp', (usermodule, param) => {
    console.log(usermodule);
    console.log(param);

    // result = usermodule.find(x => x.moduleName == param) ? true : false;
    // console.log(usermodule.find(x => x.moduleName == param));

    // return result;
})