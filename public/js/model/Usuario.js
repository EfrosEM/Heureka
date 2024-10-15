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

const Usuario = mongoose.model('Usuario', UsuarioSchema);
module.exports = Usuario;
