const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir esquema de usuario
const UsuarioSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    alta: {
        type: Date,
        required: true
    },
    games: {
        type: Number,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    preguntas: {
        type: Number,
        required: true
    },
    aciertos: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },

});

// Método para encriptar la contraseña antes de guardar el usuario
UsuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar la contraseña introducida con la almacenada en la base de datos
UsuarioSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para sumar puntos a los puntos actuales
UsuarioSchema.methods.addPoints = async function(newPoints) {
    this.points+=newPoints;
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
