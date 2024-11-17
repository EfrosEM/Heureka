const msg = {
    es: {
        error: "Error al eliminar la cuenta."
    },
    en: {
        error: "Error deleting account."
    }
};

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
            showAlert(result.msg, 'danger');
        }

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        showAlert('error', 'danger');
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

// Función para mostrar la alerta
function showAlert(messageKey, type) {
    const language = document.getElementById('language-select').value;
    const message = msg[language][messageKey];

    let icon = '<i class="bi bi-exclamation-triangle-fill"></i>';

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `${icon} ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

    // Añadir la alerta al contenedor
    const messageContainer = document.getElementById('message-container');
    // Limpia cualquier mensaje previo
    messageContainer.innerHTML = '';
    messageContainer.appendChild(alertDiv);

    // Hacer que desaparezca después de 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
};