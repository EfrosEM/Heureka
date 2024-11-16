const express = require('express');
const router = express.Router();
const Tarjeta = require('../models/Tarjeta');
const Heuristica = require('../models/Heuristica');
const Usuario = require('../models/Usuario');

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

// Ruta para subir usuarios de prueba a la base de datos
router.post('/cargar-usuarios', async (req, res) => {
    try {
        for (i = 0; i < 20; i++) {
            const nuevoUsuario = new Usuario({
                user: `user${i}`,
                email: `user${i}@um.es`,
                password: `user${i}`,
                points: 0,
                alta: new Date(Date.now()),
                games: 0,
                wins: 0,
                preguntas: 0,
                aciertos: 0,
                time: 0
            });
            await nuevoUsuario.save();
            console.log('Usuario guardado:', nuevoUsuario);
        }

        return res.status(200).json({ success: true, msg: 'Usuarios cargados correctamente' });
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        return res.status(500).json({ success: false, msg: 'Error al cargar los usuarios', error: error.message });
    }
});

module.exports = router;
