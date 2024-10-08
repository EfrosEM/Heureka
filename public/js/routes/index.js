const express = require('express');
const router = express.Router();

// Middleware para proteger rutas
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

// Ruta protegida
router.get('/index', ensureAuthenticated, (req, res) => {
    res.send('Home: Bienvenido!');
});

module.exports = router;
