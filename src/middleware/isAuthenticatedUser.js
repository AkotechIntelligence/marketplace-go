const isAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.type === 'user') {
        next();
    } else {
        req.flash('error', 'Please log in as a user to access this area');
        res.redirect('/auth/user/login');
    }
};

module.exports = isAuthenticatedUser;