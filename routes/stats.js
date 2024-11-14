const express = require('express');
const router = express.Router();

// Ruta para actualizar stats de usuario
router.post('/stats', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'error' });
    }

    const { points, preguntas, aciertos, tiempo } = req.body;

    req.user.addPoints(points);
    req.user.addPreguntas(preguntas);
    req.user.addAciertos(aciertos);
    req.user.addTime(tiempo);

    await req.user.save();

    return res.status(200).json({ success: true, msg: 'success' });
});

// Ruta para sumar bonus de puntos al ganar partida
router.post('/win', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'error' });
    }

    const { points } = req.body;

    req.user.addPoints(points);
    req.user.addWin();

    await req.user.save();

    return res.status(200).json({ success: true, msg: 'success' });
});

// Ruta para sumar partida jugada al total de partidas jugadas
router.post('/game', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'error' });
    }

    req.user.addGame();
    await req.user.save();

    return res.status(200).json({ success: true, msg: 'success' });
});

module.exports = router;