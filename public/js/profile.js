document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/users/profile');
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        const usuario = await response.json();

        // Mostrar los datos en el HTML
        document.getElementById('username').textContent = usuario.user;
        document.getElementById('email').textContent = usuario.email;
        document.getElementById('points').textContent = usuario.points;
        document.getElementById('alta').textContent = usuario.alta;
        document.getElementById('wins').textContent = usuario.wins;
        document.getElementById('games').textContent = usuario.games;
        document.getElementById('aciertos').textContent = usuario.aciertos;
        document.getElementById('preguntas').textContent = usuario.preguntas;
        document.getElementById('time').textContent = usuario.time;

    } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
        window.location.href = '/login.html';  // Redirigir si no está autenticado
    }
});