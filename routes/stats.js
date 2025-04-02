const express = require('express');
const router = express.Router();

// Ruta para actualizar stats de usuario
router.post('/stats', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'error' });
    }

    const { points, preguntas, aciertos, tiempo, bonus, avanzar } = req.body;

    req.user.addPoints(points);
    req.user.addPreguntas(preguntas);
    req.user.addAciertos(aciertos);
    req.user.addTime(tiempo);
    req.user.addGame();

    if (avanzar) {
        // Avanzamos de nivel si el usuario ha ganado la partida
        req.user.avanzarNivel();
    }

    if (bonus > 0) {
        // Sumamos el bonus y la victoria si ha ganado la partida
        req.user.addPoints(bonus);
        req.user.addWin();
    }

    await req.user.save();

    return res.status(200).json({ success: true, msg: 'success' });
});

module.exports = router;