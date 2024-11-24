document.getElementById("deleteAccountButton").addEventListener("click", async function () {
    try {
        // Enviar la petición al servidor
        const response = await fetch('/users/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        // Manejar las respuestas
        if (result.success) {
            logout();
        } else {
            // Mostrar alerta de error
            showToast(result.msg, 'danger');
        }

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        showToast('error', 'danger');
    }

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("deleteAccountModal"));
    modal.hide();
});

async function logout() {
    // Realizar la solicitud para cerrar sesión
    const response = await fetch('/users/logout', {
        method: 'GET'
    });

    // Redirigir al usuario a la página de login si la solicitud fue exitosa
    if (response.redirected) {
        window.location.href = response.url;
    }
}