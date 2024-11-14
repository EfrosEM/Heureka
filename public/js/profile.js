document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/users/profile');
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        const usuario = await response.json();

        // Calcular porcentajes de partidas ganadas y perdidas
        const totalGames = usuario.games;
        const wins = usuario.wins;
        const losses = totalGames - wins;
        const winPercentage = (wins / totalGames) * 100;
        const lossPercentage = (losses / totalGames) * 100;

        // Calcular porcentajes de fallos y aciertos
        const totalPreguntas = usuario.preguntas;
        const aciertos = usuario.aciertos;
        const fallos = totalPreguntas - aciertos;
        const aciertoPercentage = (aciertos / totalPreguntas) * 100;
        const falloPercentage = (fallos / totalPreguntas) * 100;

        // Mostrar los datos en el HTML
        document.getElementById('username').textContent = usuario.user;
        document.getElementById('email').textContent = usuario.email;
        document.getElementById('points').textContent = usuario.points;
        document.getElementById('alta').textContent = usuario.alta;
        document.getElementById('games').textContent = usuario.games;
        document.getElementById('preguntas').textContent = usuario.preguntas;
        document.getElementById('time').textContent = segundosToHHMMSS(usuario.time);

        if (totalGames > 0) {
            document.getElementById('wins').textContent = Math.round(winPercentage);
            // Actualizar las barras de progreso en función de las partidas ganadas y perdidas
            document.querySelector('.progress .progress-bar[aria-label="Partidas ganadas"]').style.width = `${winPercentage}%`;
            document.querySelector('.progress .progress-bar[aria-label="Partidas ganadas"]').textContent = wins;
            document.querySelector('.progress .progress-bar[aria-label="Partidas perdidas"]').style.width = `${lossPercentage}%`;
            document.querySelector('.progress .progress-bar[aria-label="Partidas perdidas"]').textContent = losses;
        }
        else {
            document.getElementById('wins').textContent = 0;
        }
        if (totalPreguntas > 0) {
            document.getElementById('aciertos').textContent = Math.round(aciertoPercentage);
            // Actualizar las barras de progreso en función de los fallos y aciertos
            document.querySelector('.progress .progress-bar[aria-label="Aciertos"]').style.width = `${aciertoPercentage}%`;
            document.querySelector('.progress .progress-bar[aria-label="Aciertos"]').textContent = aciertos;
            document.querySelector('.progress .progress-bar[aria-label="Fallos"]').style.width = `${falloPercentage}%`;
            document.querySelector('.progress .progress-bar[aria-label="Fallos"]').textContent = fallos;
        }
        else {
            document.getElementById('aciertos').textContent = 0;
        }
        
    } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
        window.location.href = '/login.html';  // Redirigir si no está autenticado
    }

});

function segundosToHHMMSS(segundos) { 
    let horas = Math.trunc(segundos / 3600);
    segundos %= 3600;
    let minutos = Math.trunc(segundos / 60);
    segundos %= 60;

    let cadena = horas + 'h ' + minutos + 'min ' + segundos + 's';

    return cadena;
}
