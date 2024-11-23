const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const User = require('../models/Usuario');
const Tarjeta = require('../models/Tarjeta');

// Configurar Multer para guardar archivos en "public/images/tarjetas"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/tarjetas'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    },
});
  
const upload = multer({ storage });

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
        const data = {
            tarjetas: tarjetas,
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tarjetas' });
    }
});

// Ruta para agregar una nueva tarjeta
router.post('/tarjetas', upload.single('imagen'), async (req, res) => {
    const { heuristica, esBuenEjemplo, texto, text } = req.body;
    const imagePath = `images/tarjetas/${req.file.filename}`;

    try {
        const newTarjeta = new Tarjeta({ 
            heuristica: heuristica, 
            esBuenEjemplo: esBuenEjemplo,
            texto: texto,
            text: text,
            imagen: imagePath 
        });

        await newTarjeta.save();
        res.status(201).json({ success: true, message: 'success', newTarjeta });
    } catch (error) {
        res.status(500).json({ success: false, message: 'error', error });
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
