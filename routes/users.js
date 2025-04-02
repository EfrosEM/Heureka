const express = require('express');
const router = express.Router();
const passport = require('passport');
const Usuario = require('../models/Usuario');

const { USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } = require('../config/config.js');

// Ruta para el registro
router.post('/signup', async (req, res) => {
    const { user, email, password } = req.body;
    let errors = [];

    // Validación
    if (!user || !email || !password) {
        errors.push({ msg: 'fields' });
    }

    if (user.length > USERNAME_MAX_LENGTH) {
        errors.push({ msg: 'name' });
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
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
                password: password
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
        alta: req.user.alta.toLocaleDateString(),
        games: req.user.games,
        wins: req.user.wins,
        preguntas: req.user.preguntas,
        aciertos: req.user.aciertos,
        time: req.user.time,
        rol: req.user.rol,
        nivel: req.user.nivel
    };

    res.json(usuario);
});

// Ruta para editar perfil
router.put('/edit', async (req, res) => {
    const userId = req.user.id;
    const { newUser, newEmail, newPassword } = req.body;

    try {
        // Buscar usuario por ID
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "found" });
        }

        // Actualizar los datos del usuario
        if (newUser) {
            if (newUser.length > USERNAME_MAX_LENGTH) {
                return res.status(400).json({ success: false, msg: "name" });
            }

            const userExistente = await Usuario.findOne({ user: newUser });
            if (userExistente && userExistente._id.toString() !== userId) {
                return res.status(400).json({ success: false, msg: 'user' });
            }

            user.user = newUser;
        }

        if (newEmail) {
            const emailExistente = await Usuario.findOne({ email: newEmail });
            if (emailExistente && emailExistente._id.toString() !== userId) {
                return res.status(400).json({ success: false, msg: 'email' });
            }

            user.email = newEmail;
        }

        if (newPassword) {
            if (newPassword.length < PASSWORD_MIN_LENGTH) {
                return res.status(400).json({ success: false, msg: "password" });
            }

            user.password = newPassword;
        }

        // Guardar los cambios en la base de datos
        await user.save();
        return res.status(200).json({ success: true, msg: 'success' });

    } catch (error) {
        console.error('Error al editar perfil:', error);
        return res.status(500).json({ success: false, msg: 'error' });
    }
});

// Ruta para eliminar usuario
router.delete('/delete', async (req, res) => {
    try {
        // Obtener el ID del usuario autenticado
        const userId = req.user.id;
        // Eliminar usuario de la base de datos
        await Usuario.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, msg: 'success' });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ success: false, msg: 'delete' });
    }
});

// Ruta para comprobación de contraseña
router.post('/check-password', async (req, res) => {
    const userId = req.user.id;
    const { password } = req.body;

    try {
        // Buscar usuario por ID
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "found" });
        }

        // Comparar la contraseña
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            return res.status(200).json({ success: true, msg: 'success' });
        } else {
            return res.status(400).json({ success: false, msg: 'password' });
        }

    } catch (error) {
        console.error('Error al comprobar contraseña:', error);
        return res.status(500).json({ success: false, msg: 'error' });
    }
});

module.exports = router;

