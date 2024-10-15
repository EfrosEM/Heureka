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

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
        errors.push({ msg: 'El email ya está registrado' });
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        // Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos

        // Crear nuevo usuario
        const usuario = new Usuario({
            user,
            email,
            password: hashedPassword
        });

        try {
            await usuario.save();
            res.status(201).send('Usuario registrado');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al registrar el usuario');
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

