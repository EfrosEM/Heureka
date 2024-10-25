const express = require('express');
const router = express.Router();
const passport = require('passport');
const Usuario = require('../models/Usuario');

// Ruta para el registro
router.post('/signup', async (req, res) => {
    const { user, email, password } = req.body;
    let errors = [];

    // Validación
    if (!user || !email || !password) {
        errors.push({ msg: 'fields' });
    }

    if(user.length > 30) {
        errors.push({ msg: 'name' });
    }

    if (password.length < 5) {
        errors.push({ msg: 'password' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, msg: errors[0].msg });
    } else {
        try {
            const emailExistente = await Usuario.findOne({ email: email });
            if (emailExistente) {
                return res.status(400).json({ success: false, msg: 'email' });
            }

            const userExistente = await Usuario.findOne({ user: user });
            if (userExistente) {
                return res.status(400).json({ success: false, msg: 'user' });
            }

            const nuevoUsuario = new Usuario({
                user: user,
                email: email,
                password: password,
                points: 0,
            });

            await nuevoUsuario.save();

            return res.status(200).json({ success: true, msg: 'success' });
        } catch (error) {
            console.error('Error en el registro:', error);
            return res.status(500).json({ success: false, msg: 'error' });
        }
    }
});

// Ruta para iniciar sesión
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, msg: 'error' });
        }
        if (!user) {
            // Devolver el mensaje de error según la razón (password o email incorrecto)
            return res.status(400).json({ success: false, msg: info.message });  // 'info.message' contiene el mensaje del error
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, msg: 'error' });
            }
            return res.json({ success: true, msg: 'success' });
        });
    })(req, res, next);
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ success: false, msg: 'Error al cerrar sesión' });
        }
        // Redirigir a la página de login después de cerrar sesión
        res.redirect('/login.html');
    });
});

// Ruta para obtener los datos del perfil del usuario autenticado
router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    // Si el usuario está autenticado, devolver los datos
    const usuario = {
        user: req.user.user,
        email: req.user.email,
        points: req.user.points,
        // otros datos
    };

    res.json(usuario);
});

module.exports = router;

