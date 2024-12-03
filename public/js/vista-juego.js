import {Controlador} from './controlador.js';

const BONUS_PUNTOS = process.env.BONUS_POINTS;

let controlador = null;
let translations = {};  // Aquí se almacenarán las traducciones cargadas

$(document).ready( () => {
    // Cargar el idioma antes de inicializar los elementos de la página
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';

    // Cargar el idioma y después inicializar el juego
    cargarIdioma(selectedLang).then(() => {
        inicializarPagina();  // Este es el siguiente paso
    }).catch((error) => {
        console.error('Error al cargar el idioma:', error);
        inicializarPagina();  // Inicializar la página aunque falle la carga del idioma
    });

    // Manejar cambios en el selector de idioma
    $('#language-select').on('change', function () {
        const nuevoIdioma = $(this).val();
        cambiarIdioma(nuevoIdioma);
    });
})

function cargarIdioma(lang) {
    return $.ajax({
        url: `lang/${lang}.json`,
        type: 'GET',
        async: true
    }).then((result) => {
        translations = result;
        aplicarTraducciones();
    }).catch(() => {
        throw new Error('Error al cargar el archivo de idioma.');
    });
}

// Cambiar el idioma y recargar las traducciones
function cambiarIdioma(nuevoIdioma) {
    // Guardar el nuevo idioma en localStorage
    localStorage.setItem('selectedLanguage', nuevoIdioma);

    // Recargar las traducciones con el nuevo idioma
    cargarIdioma(nuevoIdioma).then(() => {
        aplicarTraducciones();  // Aplicar las traducciones nuevamente
        actualizarPregunta();
        actualizarTextoTarjetas();
        setBotonConfirmar();
    }).catch((error) => {
        console.error('Error al cambiar el idioma:', error);
    });
}

function inicializarPagina() {
    // Deshabilitar botón por defecto
    $("#boton-accion").prop("disabled", true);
    $("#boton-ayuda").click(clicAyuda);
    // Obtener tarjetas de juego y definiciones de heuristicas
    $('#cargando').show();

    $.ajax({
        url: '/configuracion-juego',
        type: 'GET',
        async: true,
        success: function(result, status, xhr) {
            $('#cargando').hide();
            let mazoTarjetas = result.tarjetas;
            let infoHeuristicas = result.heuristicas;
            controlador = new Controlador(mazoTarjetas, infoHeuristicas);
            setupPartida();
        },
        error: function(xhr, status, error) {
            // Manejar error si la configuración del juego falla
            window.location.href = "error500.html";
        }
    });
}

// Aplica las traducciones a los elementos existentes en el DOM
function aplicarTraducciones() {
    $('[data-i18n]').each(function () {
        const key = $(this).data('i18n');
        if (translations[key]) {
            if ($(this).is('input')) {
                // Si el elemento es un input, cambiar el valor
                $(this).val(translations[key]);
            } else {
                // Para otros elementos, cambiar el contenido de texto
                $(this).text(translations[key]);
            }
        }
    });
}

function actualizarTraducciones() {
    $('[data-i18n]').each(function () {
        const key = $(this).data('i18n');
        if (translations[key]) {
            $(this).text(translations[key]);
        }
    });
}

function setupPartida() {
    mostrarNuevaPregunta();
    actualizarCronometro();
    actualizarVidas();
    actualizarPuntos();
    setBotonConfirmar();
    setInterval(actualizarCronometro, 1000);
}

function actualizarVidas() {
    const plantillaVidas = $("#plantilla-vidas").html();
    const plantillaVidasCompilada = Handlebars.compile(plantillaVidas);

    let cadenaVidas = "";
    switch(controlador.getNumVidasActuales()) {
        case 0: cadenaVidas = "<span id=\"ultima-vida\">💀</span>💀💀"; break;
        case 1: cadenaVidas = "❤️<span id=\"ultima-vida\">💀</span>💀"; break;
        case 2: cadenaVidas = "❤️❤️<span id=\"ultima-vida\">💀</span>"; break;
        case 3: cadenaVidas = "❤️❤️❤️"; break;
    }

    var contexto = {
        "vidas" : cadenaVidas
    };

    $("#vidas").html(plantillaVidasCompilada(contexto));
    // Aplicar traducciones después de actualizar las vidas
    actualizarTraducciones();
}

function actualizarCronometro() {
    const plantillaCronometro = $("#plantilla-cronometro").html();
    const plantillaCronometroCompilada = Handlebars.compile(plantillaCronometro);
   
    var contexto = {
        "cronometro" : cronometroToString(controlador.leerValorCronometro())
    };

    $("#cronometro").html(plantillaCronometroCompilada(contexto));
    // Aplicar traducciones después de actualizar el cronometro
    actualizarTraducciones();
}

function actualizarPuntos() {
    const plantillaPuntos = $("#plantilla-puntos").html();
    const plantillaPuntosCompilada = Handlebars.compile(plantillaPuntos);
   
    var contexto = {
        "puntos" : controlador.getPuntosActuales()
    };

    $("#puntos").html(plantillaPuntosCompilada(contexto));
    // Aplicar traducciones después de actualizar los puntos
    actualizarTraducciones();
}


function mostrarNuevaPregunta() {

    // Iniciar cronómetro
    controlador.iniciarCronometro();

    const preguntaActual = controlador.nuevaPregunta();

    // Obtener el contexto dinámico con las traducciones
    const contexto = obtenerContexto(preguntaActual);

    const plantillaHeuristica = $("#plantilla-heuristica").html();
    const plantillaAyuda = $("#plantilla-ayuda").html();
    const plantillaRespuestas = $("#plantilla-respuestas").html();
    const plantillaHeuristicaCompilada = Handlebars.compile(plantillaHeuristica);
    const plantillaRespuestasCompilada = Handlebars.compile(plantillaRespuestas);
    const plantillaAyudaCompilada = Handlebars.compile(plantillaAyuda);

    // Actualizar interfaz con pregunta
    $("#heuristica").html(plantillaHeuristicaCompilada(contexto));
    $("#mal-ejemplo").addClass("animar");
    $("#tarjetas").html(plantillaRespuestasCompilada(contexto));
    $("#ayuda").html(plantillaAyudaCompilada(contexto));

    aplicarTraducciones();  // Aplicamos las traducciones a los elementos dinámicos
    actualizarTextoTarjetas();

    // Manejar selección de respuesta
    $(".tarjeta").click(clicTarjeta);
    // Manejar clic en "confirmar" respuesta
    $("#boton-accion").click(mostrarCorreccion);
    $("#boton-accion").removeClass("animar");
}

function obtenerContexto(preguntaActual) {
    
    // Obtener traducciones dinámicamente
    const cumplaTexto = translations['cumpla'] || "👍 CUMPLA";  // Valor por defecto si no existe la traducción
    const incumplaTexto = translations['incumpla'] || "👎 INCUMPLA";  // Valor por defecto si no existe la traducción

    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
        
    if (selectedLanguage === "es") {   
        var contexto = {
            "numPregunta": controlador.getNumPreguntadas(),
            "cumpla": preguntaActual.esBuenEjemplo ? cumplaTexto : "",
            "incumpla": preguntaActual.esBuenEjemplo ? "" : incumplaTexto,
            "numHeuristica": preguntaActual.numHeuristica,
            "tarjetas": preguntaActual.tarjetasRespuesta,
            "ayuda": preguntaActual.definicionHeuristica,
            "nombreHeuristica": preguntaActual.nombreHeuristica
        };
    } else if (selectedLanguage === "en") {
        var contexto = {
            "numPregunta": controlador.getNumPreguntadas(),
            "cumpla": preguntaActual.esBuenEjemplo ? cumplaTexto : "",
            "incumpla": preguntaActual.esBuenEjemplo ? "" : incumplaTexto,
            "numHeuristica": preguntaActual.numHeuristica,
            "tarjetas": preguntaActual.tarjetasRespuesta,
            "ayuda": preguntaActual.helpHeuristica,
            "nombreHeuristica": preguntaActual.nameHeuristica
        };
    }

    return contexto;
}

function actualizarPregunta() {

    const preguntaActual = controlador.getPreguntaActual();
    // Definir el contexto con la pregunta actual
    var contexto = obtenerContexto(preguntaActual);

    // Actualizar la interfaz con las nuevas traducciones sin avanzar en la pregunta
    const plantillaHeuristica = $("#plantilla-heuristica").html();
    const plantillaAyuda = $("#plantilla-ayuda").html();
    const plantillaRespuestas = $("#plantilla-respuestas").html();

    const plantillaHeuristicaCompilada = Handlebars.compile(plantillaHeuristica);
    const plantillaRespuestasCompilada = Handlebars.compile(plantillaRespuestas);
    const plantillaAyudaCompilada = Handlebars.compile(plantillaAyuda);

    // Actualizar el DOM
    $("#heuristica").html(plantillaHeuristicaCompilada(contexto));
    $("#tarjetas").html(plantillaRespuestasCompilada(contexto));
    $("#ayuda").html(plantillaAyudaCompilada(contexto));

    // Manejar selección de respuesta
    $(".tarjeta").click(clicTarjeta);
    // Manejar clic en "confirmar" respuesta
    $("#boton-accion").removeClass("animar");

    // Aplicar las traducciones a los elementos que tienen data-i18n
    aplicarTraducciones();
    actualizarTextoTarjetas();
}

function actualizarTextoTarjetas() {
    const idioma = document.getElementById("language-select").value;
    const tarjetas = document.querySelectorAll('.texto-tarjeta');

    tarjetas.forEach((tarjeta) => {
        const textoEs = tarjeta.getAttribute('data-es');
        const textoEn = tarjeta.getAttribute('data-en');

        // Change text based on language
        if (idioma === 'es') {
            tarjeta.textContent = textoEs;
        } else {
            tarjeta.textContent = textoEn;
        }
    });
}

function mostrarCorreccion() {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;

    // Pausar cronómetro
    controlador.pausarCronometro();

    // Inhabilitar selección de nuevas tarjetas
    $(".tarjeta").off("click");

    // Cambiar botón "Confirmar" a "Terminar partida" o "Siguiente pregunta"
    if (controlador.haTerminadoPartida()) {
        let haGanado = true;
        setBotonTerminarPartida(haGanado);
    } else {
        setBotonSiguientePregunta();
    }

    // Marcar en rojo respuesta seleccionada
    $(".tarjeta.active").css("border-color", "red");
    $(".tarjeta.active").css("background-color", "rgba(255,0,0, .1)");
    let idTarjetaSeleccionada = $(".tarjeta.active").attr("id");

    if (selectedLanguage === "es") {   
        $(`#etiqueta-correccion-${idTarjetaSeleccionada}`).html("Respuesta incorrecta.");
    } else if (selectedLanguage === "en") {
        $(`#etiqueta-correccion-${idTarjetaSeleccionada}`).html("Wrong answer.");
    }
    

    // Marcar en verde respuesta correcta
    // (si es la seleccionada sobreescribe el rojo)
    let idCorrecta = controlador.getPreguntaActual().idTarjetaCorrecta;
    let correcta = $("#tarjetas").find(`#${idCorrecta}`);
    correcta.css("border-color", "green");
    correcta.css("background-color", "rgba(51, 170, 51, .1)");

    if (selectedLanguage === "es") {   
        $(`#etiqueta-correccion-${idCorrecta}`).html("Respuesta correcta.");
    } else if (selectedLanguage === "en") {
        $(`#etiqueta-correccion-${idCorrecta}`).html("Correct answer.");
    }

    // Animar tick en respuesta correcta
    $(".tick-contenedor").removeClass("animar");
    $(`#tick-contenedor-${idCorrecta}`).addClass("animar");

    // Si la respuesta es incorrecta, animar cruz y restar vida
    if (!controlador.esRespuestaCorrecta(idTarjetaSeleccionada)) {

        // Sonido respuesta incorrecta
        $("#audio-respuesta-incorrecta")[0].volume = 0.3;
        $("#audio-respuesta-incorrecta")[0].play();

        $(`#cruz-contenedor-${idTarjetaSeleccionada}`).addClass("animar");

        controlador.restarVida();

        if (controlador.getNumVidasActuales() == 0) {
            actualizarVidas();
            let haGanado = false;
            setBotonTerminarPartida(haGanado);
        } else {
            actualizarCronometro();
            actualizarVidas();
        }
        // Animación restar vida
        $("#ultima-vida").addClass("animar");
    } else {
        // Sonido respuesta correcta
        $("#audio-respuesta-correcta")[0].volume = 0.3;
        $("#audio-respuesta-correcta")[0].play();

        addPoints();
        actualizarPuntos();
    }
}

function clicAyuda() {
    $(".audio-boton-auxiliar")[0].volume = 0.3;
    $(".audio-boton-auxiliar")[0].play();

    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
        
    if (selectedLanguage === "es") {   
        if (!$("#ayuda").hasClass("animar")) {
            $("#ayuda").attr("role", "alert");
            $("#ayuda").addClass("animar");
            $("#boton-ayuda").val("Ver definición ➖");
        } else {
            $("#ayuda").removeAttr("role");
            $("#ayuda").removeClass("animar");
            $("#boton-ayuda").val("Ver definición ➕");
        }
    } else if (selectedLanguage === "en") {
        if (!$("#ayuda").hasClass("animar")) {
            $("#ayuda").attr("role", "alert");
            $("#ayuda").addClass("animar");
            $("#boton-ayuda").val("Show definition ➖");
        } else {
            $("#ayuda").removeAttr("role");
            $("#ayuda").removeClass("animar");
            $("#boton-ayuda").val("Show definition ➕");
        }
    }

}

function terminarPartida(haGanado) {

    const acertadas = controlador.getNumAcertadas();
    const total = controlador.getNumPreguntadas();
    const tiempo = controlador.leerValorCronometro();
    const puntos = controlador.getPuntosActuales();

    let queryString = 
        `?acertadas=${encodeURIComponent(acertadas)}`
        +`&total=${encodeURIComponent(total)}`
        +`&tiempo=${encodeURIComponent(cronometroToString(tiempo))}`
        +`&puntos=${encodeURIComponent(puntos)}`;

    if (haGanado) {
        // Se actualizan las estadísticas del usuario con un bonus de puntos por ganar la partida
        actualizarStats(puntos, total, acertadas, tiempoEnSegundos(tiempo), BONUS_PUNTOS);

        window.location.href = "has-ganado.html" + queryString;
    } else {
        // Se actualizan las estadísticas del usuario
        actualizarStats(puntos, total, acertadas, tiempoEnSegundos(tiempo), 0);

        window.location.href = "has-perdido.html" + queryString;
    }
}

function setBotonTerminarPartida(haGanado) {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
        
    if (selectedLanguage === "es") {   
        $("#boton-accion").val('Terminar partida');
    } else if (selectedLanguage === "en") {
        $("#boton-accion").val('End game');
    }
    
    $("#boton-accion").off('click');
    $("#boton-accion").click(() => {
        terminarPartida(haGanado);
    });
}

function setBotonSiguientePregunta() {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
        
    if (selectedLanguage === "es") {   
        $("#boton-accion").val('Siguiente pregunta');
    } else if (selectedLanguage === "en") {
        $("#boton-accion").val('Next question');
    }
    
    $("#boton-accion").off('click');
    $("#boton-accion").click(clicBotonSiguiente);
}

function setBotonConfirmar() {
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;
        
    if (selectedLanguage === "es") {   
        $("#boton-accion").val('Confirmar respuesta');
    } else if (selectedLanguage === "en") {
        $("#boton-accion").val('Confirm response');
    }

    // Cambiar manejador
    $("#boton-accion").off('click');
    $("#boton-accion").click(mostrarCorreccion);

    // Deshabilitar por defecto
    $("#boton-accion").prop("disabled", true);
}

function clicBotonSiguiente() {
    $(".audio-boton-auxiliar")[0].volume = 0.3;
    $(".audio-boton-auxiliar")[0].play();
    mostrarNuevaPregunta();
    setBotonConfirmar();
}

function cronometroToString(HHMMSS) {

    let cadenaCronometro = "";

    if (HHMMSS.horas > 0) {
        cadenaCronometro += `${HHMMSS.horas} h `
    }
    if (HHMMSS.minutos > 0) {
        cadenaCronometro += `${HHMMSS.minutos} min `
    }
    if (HHMMSS.segundos > 0) {
        cadenaCronometro += `${HHMMSS.segundos} s`
    }

    return cadenaCronometro;
}

function tiempoEnSegundos(tiempo) {
    const { horas, minutos, segundos } = tiempo;
    return (horas * 3600) + (minutos * 60) + segundos;
}

function clicTarjeta(event) {
    // Efecto de sonido
    $("#audio-clic-tarjeta")[0].volume = 0.3;
    $("#audio-clic-tarjeta")[0].play();

    if($(event.currentTarget).hasClass("active")) {
        // Animar deselección
        $(event.currentTarget).removeClass("active");

        // Deshabilitar botón "confirmar"
        $("#boton-accion").prop("disabled", true);
        $("#boton-accion").removeClass("animar");
    }
    else {
        // Animar selección
        $(".tarjeta").removeClass("active");
        $(event.currentTarget).addClass("active");

        // Habilitar botón "confirmar"
        $("#boton-accion").prop("disabled", false);
        $("#boton-accion").addClass("animar");
    }
}

async function actualizarStats(puntos, preguntas, aciertos, tiempo, bonus) {
    const data = {
        points: puntos,
        preguntas: preguntas,
        aciertos: aciertos,
        tiempo: tiempo,
        bonus: bonus
    };

    const response = await fetch('/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
}

async function addPoints(){

    const points = controlador.calcularPuntos();
    controlador.addPuntos(points);

    showAlert('success', points, 'success');
}

// Función para mostrar la alerta
function showAlert(messageKey, points, type) {
    const language = document.getElementById('language-select').value;

    const messages = {
        es: {
            success: " Puntos añadidos!",
            error: "No autorizado",
        },
        en: {
            success: " Points added!",
            error: "Unauthorized",
        }
    };
    
    let message, icon;

    if(type == "success"){
        icon = `<i class="bi bi-star-fill text-warning"></i>`;
        message = points + messages[language][messageKey];
    } else {
        icon = `<i class="bi bi-exclamation-triangle-fill"></i>`;
        message = messages[language][messageKey];
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `<strong>${icon} ${message}</strong>`;

    // Añadir la alerta al contenedor
    const pointsContainer = document.getElementById('points-container');
    pointsContainer.innerHTML = '';  // Limpiar mensajes previos
    pointsContainer.appendChild(alertDiv);

    // Hacer que desaparezca después de 10 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}