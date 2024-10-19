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

    if (password.length < 5) {
        errors.push({ msg: 'password' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, msg: errors[0].msg });
    } else {
        try {
            const usuarioExistente = await Usuario.findOne({ email: email });
            if (usuarioExistente) {
                return res.status(400).json({ success: false, msg: 'email' });
            }

            const nuevoUsuario = new Usuario({
                user: user,
                email: email,
                password: password,
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

module.exports = router;

