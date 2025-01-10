const isMerchant = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.type === 'merchant') {
        next();
    } else {
        res.status(403).render('errors/403', {
            title: "403 Forbidden",
            layout: "layout/blank-layout"
        });
    }
};

module.exports = isMerchant;