const Tarjeta = require('./models/Tarjeta');
const Heuristica = require('./models/Heuristica');
const Usuario = require('./models/Usuario');

const tarjetas = require('./data/tarjetas.json'); // Archivo con las tarjetas
const heuristicas = require('./data/heuristicas.json'); // Archivo con las heurísticas

async function cargarDatosIniciales() {
    const tarjetasCount = await Tarjeta.countDocuments();
    const heuristicasCount = await Heuristica.countDocuments();

    if (tarjetasCount === 0 && heuristicasCount === 0) {
        console.log('🔄 Cargando tarjetas y heurísticas iniciales...');
        for (const tarjeta of tarjetas) {
            const nuevaTarjeta = new Tarjeta(tarjeta);
            await nuevaTarjeta.save();
        }
        for (const heuristica of heuristicas) {
            const nuevaHeuristica = new Heuristica(heuristica);
            await nuevaHeuristica.save();
        }
        console.log('✅ Tarjetas y heurísticas cargadas.');
    } else {
        console.log('✔️ Ya existen tarjetas y heurísticas. No se cargaron datos.');
    }
}

async function cargarAdminInicial() {
    const profesorExistente = await Usuario.findOne({ rol: 'PROFESOR' });

    if (!profesorExistente) {
        console.log('🔄 Creando usuario admin...');
        const nuevoAdmin = new Usuario({
            user: `admin`,
            email: `admin@um.es`,
            password: `admin`,
            rol: 'PROFESOR'
        });
        await nuevoAdmin.save();
        console.log('✅ Usuario admin creado.');
    } else {
        console.log('✔️ Ya existe un usuario administrador. No se creó uno nuevo.');
    }
}


module.exports = {
    cargarDatosIniciales,
    cargarAdminInicial
};