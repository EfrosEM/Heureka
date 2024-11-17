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
        required: true,
        default: 0
    },
    alta: {
        type: Date,
        required: true,
        default: Date.now
    },
    games: {
        type: Number,
        required: true,
        default: 0
    },
    wins: {
        type: Number,
        required: true,
        default: 0
    },
    preguntas: {
        type: Number,
        required: true,
        default: 0
    },
    aciertos: {
        type: Number,
        required: true,
        default: 0
    },
    time: {
        type: Number,
        required: true,
        default: 0
    },
    rol: {
        type: String,
        required: true,
        enum: ['ALUMNO', 'PROFESOR'],
        default: 'ALUMNO'
    }
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
UsuarioSchema.methods.addPoints = function(newPoints) {
    this.points+=newPoints;
};

// Método para añadir una nueva partida jugada al total de partidas jugadas
UsuarioSchema.methods.addGame = function() {
    this.games++;
};

// Método para añadir una nueva victoria al total de victorias
UsuarioSchema.methods.addWin = function() {
    this.wins++;
};

// Método para sumar las nuevas preguntas a las preguntas totales contestadas
UsuarioSchema.methods.addPreguntas = function(newPreguntas) {
    this.preguntas+=newPreguntas;
};

// Método para sumar los nuevos aciertos a los aciertos totales
UsuarioSchema.methods.addAciertos = function(newAciertos) {
    this.aciertos+=newAciertos;
};

// Método para sumar el tiempo de partida al tiempo jugado total
UsuarioSchema.methods.addTime = function(newTime) {
    this.time+=newTime;
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
