/**
 * Middleware to check if a user is logged in before accessing protected routes.
 * If the user is not logged in, they will be redirected to the specified path.
 * 
 * @param {string} [redirectTo='/'] - The path to redirect to if the user is not logged in.
 * @returns {function} Express middleware function.
 */

module.exports = (redirectTo = '/') => {
    return (req, res, next) => {
        if (!req.session.isLoggedIn) {
            return res.redirect(redirectTo);
        }
        next();
    }
}