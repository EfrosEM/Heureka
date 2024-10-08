const express = require('express');
const path = require('path');
const tarjetas = require('./tarjetas.json');
const heuristicas = require('./heuristicas.json');
const fs = require('fs');

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();

const PORT = process.env.PORT || 5000;

// TODO: Conectar a MongoDB
mongoose.connect('mongodb://localhost/tu-base-de-datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado'))
.catch(err => console.log(err));

// Body parser para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
    secret: 'secreto', // Llave secreta para sesiones
    resave: true,
    saveUninitialized: true
}));

// Passport middleware para autenticación
app.use(passport.initialize());
app.use(passport.session());

// Mensajes de error (flash)
app.use(flash());

// Rutas para la aplicación
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

require('./config/passport')(passport); // Configuración de Passport

app.get('/configuracion-juego', function(req, res) {
  res.send({ tarjetas: tarjetas, heuristicas: heuristicas });
})

app.get('/tests.html', function(req, res) {
  if (process.env.NODE_ENV  === "dev") {
    res.sendFile(path.join(__dirname, '/public/html/tests.html'));
  } else {
    filePath = path.join(__dirname, '/public/html/error403.html');

    fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
      if (!err) {
        res.setHeader('content-type', 'text/html');
        res.status(403).send(data);
      } else {
        res.status(500);
      }
    });
  }
});

app.get('/error500.html', function(req, res) {
  filePath = path.join(__dirname, '/public/html/error500.html');

  fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
    if (!err) {
      res.setHeader('content-type', 'text/html');
      res.status(500).send(data);
    } else {
      res.status(500);
    }
  });
});

// Serve all client-side files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {

  filePath = path.join(__dirname, '/public/html/error404.html');

  fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
      if (!err) {
        res.status(404).send(data);
      } else {
        res.status(500).send("Error del servidor");
      }
  });
});

app.listen(PORT, () => {
  console.log(`Heureka listening on port ${PORT}!`)
});