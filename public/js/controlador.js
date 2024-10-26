import { Partida } from './model/Partida.js';

export class Controlador {

    constructor(mazoTarjetas, infoHeuristicas) {
        this.partidaActual = new Partida(mazoTarjetas, infoHeuristicas);
        this.ultimoTiempoRespuesta = 0;  // Tiempo en segundos del último cálculo de puntos
    }

    nuevaPregunta() {
        return this.partidaActual.nuevaPregunta();
    }

    esRespuestaCorrecta(idTarjetaSeleccionada) {
        return this.partidaActual.esRespuestaCorrecta(idTarjetaSeleccionada);
    }

    getPreguntaActual() {
        return this.partidaActual.preguntaActual;
    }

    getNumVidasActuales() {
        return this.partidaActual.numVidasActuales;
    }

    restarVida() {
        this.partidaActual.restarVida();
    }

    haTerminadoPartida() {
        return this.partidaActual.haTerminadoPartida();
    }

    getNumAcertadas() {
        return this.partidaActual.numAcertadas;
    }

    getNumPreguntadas() {
        return this.partidaActual.getNumPreguntadas();
    }

    iniciarCronometro() {
        this.partidaActual.iniciarCronometro();
    }

    pausarCronometro() {
        this.partidaActual.pausarCronometro();
    }

    leerValorCronometro() {
        return this.partidaActual.leerValorCronometro();
    }

    getPuntosActuales() {
        return this.partidaActual.puntos;
    }

    addPuntos(puntos) {
        this.partidaActual.addPuntos(puntos);
    }

    calcularPuntos() {
        // TODO: Calcular la cantidad de puntos en función de la dificultad
        // Puntos base (máximos que se pueden obtener si se responde rápido)
        const puntosBase = 100;

        // Leer el tiempo actual de partida
        const tiempoActual = this.partidaActual.getSegundos();

        // Calcular el tiempo transcurrido desde la última respuesta
        const tiempoRespuesta = tiempoActual - this.ultimoTiempoRespuesta;

        // Calcular puntos según el tiempo transcurrido desde la última respuesta
        const penalizacion = Math.min(1, 0.02 * tiempoRespuesta);
        let puntosObtenidos = Math.round(puntosBase * (1 - penalizacion));

        // Asegurar un mínimo de puntos
        puntosObtenidos = Math.max(10, puntosObtenidos);

        // Actualizar el último tiempo de respuesta para la próxima pregunta
        this.ultimoTiempoRespuesta = tiempoActual;

        // Retornar los puntos calculados
        return puntosObtenidos;
    }
}