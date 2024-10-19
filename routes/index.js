const express = require('express');
const router = express.Router();
const path = require('path');


// Middleware para proteger rutas
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login.html');
}

// Rutas protegidas
router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/index.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/fuentes.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/fuentes.html'));
});

router.get('/game.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/game.html'));
});

router.get('/has-ganado.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/has-ganado.html'));
});

router.get('/has-perdido.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/has-perdido.html'));
});

router.get('/sitemap.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/sitemap.html'));
});

router.get('/descripcion-diagrama.html', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/descripcion-diagrama.html'));
});

module.exports = router;
