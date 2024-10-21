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
    } catch (error) {
        console.error('Error al obtener los datos del perfil:', error);
        window.location.href = '/login';  // Redirigir si no está autenticado
    }
});