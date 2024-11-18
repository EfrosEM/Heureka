const form = document.getElementById('resetPasswordForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const response = await fetch(`/recovery/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            newPassword: form.password.value,
            confirmPassword: form.confirmPassword.value
        })
    });

    const result = await response.json();
    // Manejar las respuestas
    if (result.success) {
        // Mostrar alerta de éxito
        showAlert(result.msg, 'success');
    } else {
        // Mostrar alerta de error
        showAlert(result.msg, 'danger');
    }
});

const messages = {
    es: {
        link: "El enlace de restablecimiento de contraseña no es válido o ha expirado.",
        password: "Las contraseñas no coinciden.",
        longitud: "La contraseña debe tener al menos 5 caracteres.",
        success: "Contraseña restablecida correctamente.",
        error: "Error al restablecer la contraseña",
    },
    en: {
        link: "The password reset link is invalid or has expired.",
        password: "Passwords do not match.",
        longitud: "Password must be at least 5 characters long.",
        success: "Password reset successfully.",
        error: "Error resetting password.",
    }
};

// Función para mostrar la alerta
function showAlert(messageKey, type) {
    const language = document.getElementById('language-select').value;
    const message = messages[language][messageKey];

    let icon = "";
    if(type == "success"){
        icon = `<i class="bi bi-check-circle-fill"></i>`;
    } else {
        icon = `<i class="bi bi-exclamation-triangle-fill"></i>`;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `${icon} ${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

    // Añadir la alerta al contenedor
    const messageContainer = document.getElementById('message-container');
    messageContainer.innerHTML = '';  // Limpiar mensajes previos
    messageContainer.appendChild(alertDiv);

    // Hacer que desaparezca después de 10 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 10000);
}