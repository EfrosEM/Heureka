const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Usuario = require('../model/Usuario');

// Ruta para el registro
router.post('/signup', async (req, res) => {
    const { user, email, password } = req.body;
    let errors = [];

    // Validación
    if (!user || !email || !password) {
        errors.push({ msg: 'Por favor llena todos los campos' });
    }

    if (errors.length > 0) {
        res.send('Errores en el registro');
    } else {
        const usuario = new Usuario({ user, email, password });
        await usuario.save();
        res.send('Usuario registrado');
    }
});

// Ruta para iniciar sesión
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;
