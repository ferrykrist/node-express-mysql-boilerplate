exports.homePage = (req, res, next) => {
    let data = {
        layout: 'admin_layout',
        pageTitle: 'Home',
    };
    res.render('home', data);
};