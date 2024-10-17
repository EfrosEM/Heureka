const express = require('express');
const router = express.Router();

// Middleware para proteger rutas
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login.html');
}

// Ruta protegida
router.get('/', ensureAuthenticated, (req, res) => {
    res.send('Home: Bienvenido!');
});

router.get('/index.html', ensureAuthenticated, (req, res) => {
    res.send('Home: Bienvenido!');
});

module.exports = router;
