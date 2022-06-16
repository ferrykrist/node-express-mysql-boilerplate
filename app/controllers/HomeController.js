exports.homePage = (req, res, next) => {

    let vars = {
        layout: 'admin_layout',
        pageTitle: 'test'
    };
    res.render('home', vars);
};