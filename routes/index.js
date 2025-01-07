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

// Middleware para verificar el rol del usuario
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.rol)) {
            return res.redirect('/error403.html'); // El usuario no tiene permiso
        }
        next(); // El usuario tiene el rol permitido
    };
}

// Rutas protegidas
router.get('/', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/index.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.get('/fuentes.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/fuentes.html'));
});

router.get('/game.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/game.html'));
});

router.get('/has-ganado.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/has-ganado.html'));
});

router.get('/has-perdido.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/has-perdido.html'));
});

router.get('/sitemap.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/sitemap.html'));
});

router.get('/descripcion-diagrama.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/descripcion-diagrama.html'));
});

router.get('/standings.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/standings.html'));
});

router.get('/profile.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/profile.html'));
});

router.get('/users.html', ensureAuthenticated, authorizeRoles('PROFESOR'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/users.html'));
});

router.get('/tarjetas.html', ensureAuthenticated, authorizeRoles('PROFESOR'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/tarjetas.html'));
});

router.get('/level-select.html', ensureAuthenticated, authorizeRoles('PROFESOR','ALUMNO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html/level-select.html'));
});

module.exports = router;
