const isAuthenticatedMerchant = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.type === 'merchant') {
        next();
    } else {
        req.flash('error', 'Please log in as a merchant to access this area');
        res.redirect('/auth/merchant/login');
    }
};

module.exports = isAuthenticatedMerchant;