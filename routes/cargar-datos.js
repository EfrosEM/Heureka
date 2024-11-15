const express = require('express');
const router = express.Router();
const Tarjeta = require('../models/Tarjeta');
const Heuristica = require('../models/Heuristica');

const tarjetas = require('../tarjetas.json'); // Archivo con las tarjetas
const heuristicas = require('../heuristicas.json'); // Archivo con las heurísticas

// Ruta para subir tarjetas y heurísticas a la base de datos
router.post('/cargar-datos', async (req, res) => {
    try {
        console.log('Iniciando carga de datos...');
        for (const tarjeta of tarjetas) {
            console.log('Procesando tarjeta:', tarjeta);
            const nuevaTarjeta = new Tarjeta({
                heuristica: tarjeta.heuristica,
                esBuenEjemplo: tarjeta.esBuenEjemplo,
                texto: tarjeta.texto,
                text: tarjeta.text,
                imagen: tarjeta.imagen
            });
            await nuevaTarjeta.save();
            console.log('Tarjeta guardada:', nuevaTarjeta);
        }

        for (const heuristica of heuristicas) {
            console.log('Procesando heurística:', heuristica);
            const nuevaHeuristica = new Heuristica({
                nombre: heuristica.nombre,
                ayuda: heuristica.ayuda,
                name: heuristica.name,
                help: heuristica.help
            });
            await nuevaHeuristica.save();
            console.log('Heurística guardada:', nuevaHeuristica);
        }

        return res.status(200).json({ success: true, msg: 'Datos cargados correctamente' });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return res.status(500).json({ success: false, msg: 'Error al cargar los datos', error: error.message });
    }
});

module.exports = router;
