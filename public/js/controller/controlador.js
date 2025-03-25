import { Partida } from '../model/Partida.js';

export class Controlador {

    constructor(mazoTarjetas, infoHeuristicas, dificultad) {
        this.partidaActual = new Partida(mazoTarjetas, infoHeuristicas, dificultad);
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
        // Calcular la cantidad de puntos en función de la dificultad
        let puntosDificultad = 100;
        let minimosDificultad = 10;
        if (this.partidaActual.dificultad == "intermedio") {
            puntosDificultad = 200;
            minimosDificultad = 50;
        }
        else if (this.partidaActual.dificultad == "avanzado") {
            puntosDificultad = 300;
            minimosDificultad = 100;
        }

        // Puntos base (máximos que se pueden obtener si se responde rápido)
        const puntosBase = puntosDificultad;

        // Leer el tiempo actual de partida
        const tiempoActual = this.partidaActual.getSegundos();

        // Calcular el tiempo transcurrido desde la última respuesta
        const tiempoRespuesta = tiempoActual - this.ultimoTiempoRespuesta;

        // Calcular puntos según el tiempo transcurrido desde la última respuesta
        const penalizacion = Math.min(1, 0.02 * tiempoRespuesta);
        let puntosObtenidos = Math.round(puntosBase * (1 - penalizacion));

        // Asegurar un mínimo de puntos
        puntosObtenidos = Math.max(minimosDificultad, puntosObtenidos);

        // Actualizar el último tiempo de respuesta para la próxima pregunta
        this.ultimoTiempoRespuesta = tiempoActual;

        // Retornar los puntos calculados
        return puntosObtenidos;
    }
}