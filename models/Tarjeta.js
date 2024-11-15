const mongoose = require('mongoose');

const TarjetaSchema = new mongoose.Schema({
    heuristica: {
        type: Number,
        required: true
    },
    esBuenEjemplo: {
        type: Boolean,
        required: true
    },
    texto: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
});

const Tarjeta = mongoose.model('Tarjeta', TarjetaSchema);
module.exports = Tarjeta;