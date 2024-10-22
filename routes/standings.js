const express = require('express');
const router = express.Router();
const User = require('../models/Usuario');

// Ruta para obtener el ranking de usuarios
router.get('/standings', async (req, res) => {
  try {
    // Obtener los usuarios ordenados por puntos (de mayor a menor)
    const users = await User.find().sort({ points: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
