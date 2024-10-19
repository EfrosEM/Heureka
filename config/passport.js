const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

// Estrategia Local
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await Usuario.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'email' });
        }

        // Comparar la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialización del usuario
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialización del usuario
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
