const express = require('express');
const router = express.Router();
const User = require('../models/Usuario');
const Tarjeta = require('../models/Tarjeta');

// Ruta para obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        const data = {
            users: users,
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// Ruta para obtener todas las tarjetas
router.get('/tarjetas', async (req, res) => {
    try {
        const tarjetas = await Tarjeta.find();
        res.json(tarjetas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tarjetas' });
    }
});

// Ruta para agregar una nueva tarjeta
router.post('/tarjetas', async (req, res) => {
    const { heuristica, esBuenEjemplo, texto, text, imagen } = req.body;
    try {
        const newTarjeta = new Tarjeta({ heuristica, esBuenEjemplo, texto, text, imagen });
        await newTarjeta.save();
        res.json({ message: 'Tarjeta creada exitosamente', tarjeta: newTarjeta });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarjeta' });
    }
});

// Ruta para eliminar una tarjeta
router.delete('/tarjetas/:id', async (req, res) => {
    try {
        await Tarjeta.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tarjeta eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarjeta' });
    }
});

module.exports = router;
