const isUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).render('errors/403', {
            title: "403 Forbidden",
            layout: "layout/blank-layout",
            error: "Access denied. This area is for customers only."
        });
    }
};

module.exports = isUser;