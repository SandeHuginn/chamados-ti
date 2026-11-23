function adminAuth(req, res, next) {
    if (!req.user || req.user.perfil !== 'admin') {
        return res.status(403).render('403', {
            title: 'Acesso negado'
        });
    }

    next();
}

module.exports = adminAuth;
