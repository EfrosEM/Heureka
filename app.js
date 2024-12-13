const express = require('express');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const { PORT, MONGODB_URI, NODE_ENV } = require('./config/config');

const app = express();

// Conectar a MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Body parser para manejar datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar sesiones
app.use(session({
    secret: 'secreto', // Llave secreta para sesiones
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport
require('./config/passport');  // Cargar configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas para la aplicación
app.use('/', require('./routes/index'));
app.use('/', require('./routes/standings'));
app.use('/', require('./routes/stats'));
app.use('/recovery', require('./routes/recovery'));
app.use('/users', require('./routes/users'));
app.use('/api', require('./routes/cargar-datos'));
app.use('/admin', require('./routes/admin'));

const Tarjeta = require('./models/Tarjeta');
const Heuristica = require('./models/Heuristica');

app.get('/configuracion-juego', async function(req, res) {
  try {
    // Obtener tarjetas y heurísticas de la base de datos
    const tarjetas = await Tarjeta.find().lean();
    const heuristicas = await Heuristica.find().lean();
    res.send({ tarjetas: tarjetas, heuristicas: heuristicas });
  } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).send('Error al cargar la configuración del juego');
  }
})

app.get('/tests.html', function(req, res) {
  if (NODE_ENV === "dev") {
    res.sendFile(path.join(__dirname, '/public/html/tests.html'));
  } else {
    let filePath = path.join(__dirname, '/public/html/error403.html');

    fs.readFile(filePath, {encoding: "utf-8"}, function (err, data) {
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
  let filePath = path.join(__dirname, '/public/html/error500.html');

  fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
    if (!err) {
      res.setHeader('content-type', 'text/html');
      res.status(500).send(data);
    } else {
      res.status(500);
    }
  });
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/html/signup.html');  // Ajusta la ruta si es necesario
});

// Serve all client-side files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.static(path.join(__dirname, 'public/js')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

// Catch 404 and forward to error handler
app.use(function(req, res) {

  let filePath = path.join(__dirname, '/public/html/error404.html');

  fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
      if (!err) {
        res.status(404).send(data);
      } else {
        res.status(500).send("Error del servidor");
      }
  });
});

app.listen(PORT, () => {
  console.log(`Heureka running in http://localhost:${PORT}`)
});