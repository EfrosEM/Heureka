const express = require('express');
const router = express.Router();

// Ruta para sumar puntos al usuario
router.post('/points', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ msg: 'error' });
    }

    const { points } = req.body;
    req.user.addPoints(points);
    await req.user.save();

    return res.status(200).json({ success: true, msg: 'success' });
});

module.exports = router;