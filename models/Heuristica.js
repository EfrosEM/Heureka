const mongoose = require('mongoose');

const HeuristicaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    ayuda: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    help: {
        type: String,
        required: true
    }
});

const Heuristica = mongoose.model('Heuristica', HeuristicaSchema);
module.exports = Heuristica;