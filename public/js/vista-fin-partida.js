$(document).ready( () => {

    const plantillaFeedback = $("#plantilla-feedback").html();
    const plantillaFeedbackCompilada = Handlebars.compile(plantillaFeedback);
    
    const acertadas = getParameterByName('acertadas');
    const total = getParameterByName('total');
    const tiempo = getParameterByName('tiempo');
    const puntos = getParameterByName('puntos');

    var contexto = {
        "acertadas" : acertadas,
        "total" : total,
        "tiempo" : tiempo,
        "puntos" : puntos,
    };

    addStats(Number(puntos), Number(total), Number(acertadas), tiempoEnSegundos(tiempo));

    $(".feedback").html(plantillaFeedbackCompilada(contexto));
})

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function tiempoEnSegundos(cadena) {
    // Inicializamos las variables de horas, minutos y segundos
    let horas = 0, minutos = 0, segundos = 0;
    
    // Usamos expresiones regulares para encontrar cada parte del tiempo
    const horasMatch = cadena.match(/(\d+)\s*h/);
    const minutosMatch = cadena.match(/(\d+)\s*min/);
    const segundosMatch = cadena.match(/(\d+)\s*s/);
    
    // Si se encuentra el valor, lo convertimos a número e inicializamos la variable
    if (horasMatch) horas = parseInt(horasMatch[1]);
    if (minutosMatch) minutos = parseInt(minutosMatch[1]);
    if (segundosMatch) segundos = parseInt(segundosMatch[1]);
    
    // Convertimos todo a segundos
    return (horas * 3600) + (minutos * 60) + segundos;
}

async function addStats(puntos, preguntas, aciertos, tiempo) {
    const data = {
        points: puntos,
        preguntas: preguntas,
        aciertos: aciertos,
        tiempo: tiempo
    };

    const response = await fetch('/stats/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
}