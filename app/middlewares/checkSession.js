/**
 * Middleware to check if a user has the required permission before accessing protected routes.
 * If the user does not have the required permission, they will be redirected to the specified path.
 * 
 * @param {string} permissions - The required session variable for accessing the route. Format can be like this: 'var1|var2|var3', 'var1&var2&var3'
 * @param {string} message - Message if not matched
 * @param {string} [redirectTo='/'] - The path to redirect to if the user does not have the required permissions.
 * @returns {function} Express middleware function.
 */

const constant = require('../../config/constant');
const hlp = require('../helpers/helpers');



module.exports = (permissions, message = constant.MY_NOAKSES, redirectTo = '/dashboard') => {
    if (!permissions) {
        throw new Error('Permission parameter is required for requirePermission middleware');
    }

    const msg = (permissions == 'departementId' ? constant.MY_NODEPARTEMENT : message);

    return (req, res, next) => {
        const orGroups = permissions.split('|');
        let hasPermission = false;

        for (const group of orGroups) {
            const andPermissions = group.split('&');

            const hasGroupPermission = andPermissions.every(permission => hlp.isNotEmpty(req.session[permission]));
            if (hasGroupPermission) {
                hasPermission = true;
                break;
            }
        }

        if (!hasPermission) {
            req.flash('alert', hlp.toastr({ tipe: 'error', message: msg }));
            return res.redirect(redirectTo);
        }

        // Call the next middleware function if the user has the required permission(s)
        next();
    }
}