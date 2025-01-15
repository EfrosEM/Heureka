const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const User = require('../models/Usuario');
const Tarjeta = require('../models/Tarjeta');

// Configurar Multer para guardar archivos en "public/images/tarjetas"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/tarjetas'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
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
        console.error("Error al obtener usuarios:", error);
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
        console.error("Erro al obtener tarjetas:", error);
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
        console.error(error);
        res.status(500).json({ success: false, message: 'error', error });
    }
});

// Ruta para eliminar una tarjeta
router.delete('/tarjetas/:id', async (req, res) => {
    try {
        // Buscar la tarjeta para obtener la ruta de la imagen
        const tarjeta = await Tarjeta.findById(req.params.id);
        if (!tarjeta) {
            return res.status(404).json({ success: false, msg: 'Tarjeta no encontrada' });
        }

        // Ruta completa de la imagen
        const imagePath = path.join(__dirname, '..', 'public', tarjeta.imagen);
        // Eliminar el archivo de la imagen
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error('Error al eliminar la imagen:', err);
            }
        });
        
        // Buscar y eliminar la tarjeta pasada como parámetro
        await Tarjeta.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, msg: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'error' });
    }
});

// Ruta para eliminar un usuario
router.delete('/user/:id', async (req, res) => {
    try { 
        // Buscar la tarjeta para obtener la ruta de la imagen
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'user no encontrado' });
        }

        // Buscar y eliminar el usuario pasado como parámetro
        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({ success: true, msg: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'error' });
    }
});

// Ruta para eliminar todos los usuarios menos los administradores
router.delete('/users', async (req, res) => {
    try {
        // Buscar y eliminar todos los usuarios menos los administradores
        await User.deleteMany({ rol: { $ne: 'PROFESOR' } });

        return res.status(200).json({ success: true, msg: 'success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'error' });
    }
});

module.exports = router;
