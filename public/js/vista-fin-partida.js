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