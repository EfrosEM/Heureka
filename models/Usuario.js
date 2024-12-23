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
    },
    nivel: {
        type: String,
        required: true,
        enum: ['PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO'],
        default: 'PRINCIPIANTE'
    },
    resetToken: String,
    resetTokenExpiration: Date
});

// Encriptar la contraseña antes de guardar el usuario
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

// Comparar la contraseña introducida con la almacenada en la base de datos
UsuarioSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Sumar puntos a los puntos actuales
UsuarioSchema.methods.addPoints = function(newPoints) {
    this.points+=newPoints;
};

// Añadir una nueva partida jugada al total de partidas jugadas
UsuarioSchema.methods.addGame = function() {
    this.games++;
};

// Añadir una nueva victoria al total de victorias
UsuarioSchema.methods.addWin = function() {
    this.wins++;
};

// Sumar las nuevas preguntas a las preguntas totales contestadas
UsuarioSchema.methods.addPreguntas = function(newPreguntas) {
    this.preguntas+=newPreguntas;
};

// Sumar los nuevos aciertos a los aciertos totales
UsuarioSchema.methods.addAciertos = function(newAciertos) {
    this.aciertos+=newAciertos;
};

// Sumar el tiempo de partida al tiempo jugado total
UsuarioSchema.methods.addTime = function(newTime) {
    this.time+=newTime;
};


UsuarioSchema.methods.avanzarNivel = function() {
    if(this.nivel == 'PRINCIPIANTE') {
        this.nivel = 'INTERMEDIO';
    } else if(this.nivel == 'INTERMEDIO') {
        this.nivel = 'AVANZADO';
    }
}

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
