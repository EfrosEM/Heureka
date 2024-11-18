const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Usuario = require('../models/Usuario');

const LINK = process.env.RECOVERY_LINK;

// Ruta para recuperar contraseña
router.post('/recovery', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Verifica que el email exista en la base de datos
      const user = await Usuario.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, msg: 'email' });
      }
  
      // Genera un token único y una fecha de expiración
      const token = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = Date.now() + 3600000; // Token válido por 1 hora
  
      // Guarda el token y su expiración en el usuario
      user.resetToken = token;
      user.resetTokenExpiration = tokenExpiration;
      await user.save();
  
      // Configura el transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
  
      // Configura el contenido del correo
      const resetLink = `${LINK}${token}`;
      const mailOptions = {
        to: user.email,
        subject: 'Restablecer contraseña',
        html: `
          <h3>Hola ${user.user},</h3>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para cambiarla:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Este enlace será válido por 1 hora.</p>
        `
      };
  
      // Envía el correo
      await transporter.sendMail(mailOptions);
  
      res.json({ success: true, msg: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: 'error' });
    }
});

// Ruta para mostrar el formulario de cambio de contraseña
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    // Busca el token en la base de datos
    const user = await Usuario.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

    if (!user) {
        return res.status(400).send('El enlace de restablecimiento de contraseña no es válido o ha expirado.');
    }

    // Renderizar el formulario de restablecimiento
    res.render('reset-password', { token });
});

// Ruta para restablecer contraseña
router.post('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword, confirmPassword } = req.body;

      // Encuentra al usuario por el token y verifica que no haya expirado
      const user = await Usuario.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() } // Verifica que el token no haya expirado
      });
  
      if (!user) {
        return res.status(400).json({ success: false, msg: 'link' });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, msg: 'password' });
      }

      if (newPassword.length < 5) {
        return res.status(400).json({ success: false, msg: 'longitud' });
      }
  
      // Cambia la contraseña y elimina el token
      user.password = newPassword; // Encripta la nueva contraseña
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();
  
      res.json({ success: true, msg: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, msg: 'error' });
    }
});

module.exports = router;