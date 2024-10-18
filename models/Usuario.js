const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir esquema de usuario
const UsuarioSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
