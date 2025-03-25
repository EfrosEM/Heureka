import { Pregunta } from './Pregunta.js';
import { Cronometro } from './Cronometro.js';

export class Partida {

    constructor(mazoTarjetas, infoHeuristicas, dificultad) {
        this.mazoTarjetas = mazoTarjetas;
        this.infoHeuristicas = infoHeuristicas;
        this.preguntasHechas = [];
        this.preguntaActual = null;
        this.numVidasActuales = 3;
        this.numAcertadas = 0;
        this.cronometro = new Cronometro();
        this.puntos = 0;
        this.dificultad = dificultad;
    }

    nuevaPregunta() {

        // Elegir aleatoriamente un nuevo enunciado no repetido
        let nuevoEnunciado =  this.enunciadoAleatorio();
        let heuristica = nuevoEnunciado.heuristica;
        let esBuenEjemplo = nuevoEnunciado.esBuenEjemplo;

        // Elegir aleatoriamente un nuevo conjunto de respuestas
        let respuestasAleatorias = this.respuestasAleatorias(heuristica, esBuenEjemplo);
        let tarjetas = respuestasAleatorias.tarjetas;
        let idCorrecta = respuestasAleatorias.idCorrecta;

        let nombre, ayuda, name, help;
        nombre = this.infoHeuristicas[heuristica - 1].nombre;
        ayuda = this.infoHeuristicas[heuristica - 1].ayuda;
        name = this.infoHeuristicas[heuristica - 1].name;
        help = this.infoHeuristicas[heuristica - 1].help;
        
        // Actualizar pregunta actual
        let pregunta = new Pregunta(
            heuristica,
            nombre, 
            ayuda,
            name,
            help,
            esBuenEjemplo, tarjetas, idCorrecta);
            
        this.preguntaActual = pregunta;

        // Añadir a preguntas hechas
        this.preguntasHechas.push(pregunta);

        return pregunta;
    }
    
    enunciadoAleatorio() {
        let heuristica = null;
        let esBuenEjemplo = null;

        if (this.preguntasHechas.length >= 10) {
            this.preguntasHechas = [];
        }

        while (heuristica == null) {
            heuristica = Math.floor(Math.random() * 10) + 1;
            esBuenEjemplo = Math.floor(Math.random() * 2) == 1? true : false;

            if (this.preguntasHechas.find(
                    p => p.numHeuristica == heuristica && p.esBuenEjemplo == esBuenEjemplo) 
                || (this.mazoTarjetas.find(
                    t => t.heuristica == heuristica && t.esBuenEjemplo == esBuenEjemplo) == undefined)
            ) {

                heuristica = null;
            }
        }
        return {heuristica: heuristica, esBuenEjemplo: esBuenEjemplo};
    }

    respuestasAleatorias(heuristica, esBuenEjemplo) {
        // Seleccionar aleatoriamente la respuesta correcta
        let respuestaCorrecta = null;

        while (respuestaCorrecta == null) {
            
            let indiceAleatorio = Math.floor(Math.random() * this.mazoTarjetas.length);
            let tarjetaAleatoria = this.mazoTarjetas[indiceAleatorio];

            if (tarjetaAleatoria.heuristica == heuristica &&
                tarjetaAleatoria.esBuenEjemplo == esBuenEjemplo) {
                    
                    tarjetaAleatoria.id = indiceAleatorio;
                    respuestaCorrecta = tarjetaAleatoria;
            }
        }

        // Seleccionar aleatoriamente las respuestas incorrectas sin repetición
        let respuestasIncorrectas = [];

        while (respuestasIncorrectas.length != 3) {
            
            let indiceAleatorio = Math.floor(Math.random() * this.mazoTarjetas.length);
            let tarjetaAleatoria = this.mazoTarjetas[indiceAleatorio];

            if ( (tarjetaAleatoria.heuristica != heuristica ||
                tarjetaAleatoria.esBuenEjemplo != esBuenEjemplo) && 
                !respuestasIncorrectas.includes(tarjetaAleatoria)) {

                    tarjetaAleatoria.id = indiceAleatorio;
                    respuestasIncorrectas.push(tarjetaAleatoria);
            }
        }

        let tarjetas = [respuestaCorrecta];
        tarjetas = tarjetas.concat(respuestasIncorrectas);
        tarjetas = this.barajarTarjetas(tarjetas);
        
        return {tarjetas: tarjetas, idCorrecta: respuestaCorrecta.id};
    }

    // Baraja las tarjetas de un array (algoritmo Fisher–Yates)
    barajarTarjetas(tarjetas) {
        var j, x, i;
        for (i = tarjetas.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = tarjetas[i];
            tarjetas[i] = tarjetas[j];
            tarjetas[j] = x;
        }
        return tarjetas;
    }

    esRespuestaCorrecta(idTarjetaSeleccionada) {
        if (this.preguntaActual.esRespuestaCorrecta(idTarjetaSeleccionada)) {
            this.numAcertadas++;
            return true;
        } 
        return false;
    }

    haTerminadoPartida() {
        return this.preguntasHechas.length == 10;
    }

    getNumPreguntadas() {
        return this.preguntasHechas.length;
    }

    restarVida() {
        if (this.numVidasActuales > 1) {
            this.numVidasActuales--;
        }
        else {
            this.numVidasActuales = 0;
        }
    }

    iniciarCronometro() {
        this.cronometro.iniciar();
    }

    pausarCronometro() {
        this.cronometro.pausar();
    }

    leerValorCronometro() {
        return this.cronometro.leerValor();
    }

    addPuntos(newPuntos) {
        this.puntos += newPuntos;
    }

    getSegundos() {
        return this.cronometro.getSegundosTranscurridos();
    }
}