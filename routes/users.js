const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

            // Cifrar la contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nuevoUsuario = new Usuario({
                user: user,
                email: email,
                password: hashedPassword
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

