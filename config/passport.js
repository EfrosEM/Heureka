const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

// Estrategia Local
passport.use(new LocalStrategy({
    usernameField: 'user',
    passwordField: 'password'
}, async (user, password, done) => {
    try {
        const usuario = await Usuario.findOne({ user });
        if (!usuario) {
            return done(null, false, { message: 'user' });
        }

        // Comparar la contraseña
        const isMatch = await usuario.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'password' });
        }

        return done(null, usuario);
    } catch (error) {
        return done(error);
    }
}));

// Serialización del usuario
passport.serializeUser((user, done) => {
    done(null, { id: user.id, rol: user.rol });
});

// Deserialización del usuario
passport.deserializeUser(async (data, done) => {
    try {
        const { id } = data;
        const user = await Usuario.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});