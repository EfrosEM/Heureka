document.getElementById('logout-btn').addEventListener('click', async function() {
    try {
        // Realizar la solicitud para cerrar sesión
        const response = await fetch('/users/logout', {
            method: 'GET'
        });

        // Redirigir al usuario a la página de login si la solicitud fue exitosa
        if (response.redirected) {
            window.location.href = response.url;
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

document.getElementById('logout-btn2').addEventListener('click', async function() {
    try {
        // Realizar la solicitud para cerrar sesión
        const response = await fetch('/users/logout', {
            method: 'GET'
        });

        // Redirigir al usuario a la página de login si la solicitud fue exitosa
        if (response.redirected) {
            window.location.href = response.url;
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});
