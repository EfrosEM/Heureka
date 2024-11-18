document.getElementById('recovery-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario

    const formData = new FormData(this);
    const data = {
        email: formData.get('email')
    };

    try {
        const response = await fetch('/recovery/recovery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);

        // Manejar las respuestas
        if (result.success) {
            // Mostrar alerta de éxito
            showAlert(result.msg, 'success');
        } else {
            // Mostrar alerta de error
            showAlert(result.msg, 'danger');
        }
    } catch (error) {
        // Manejo de errores de conexión
        showAlert('error', 'danger');
    }
});

const messages = {
    es: {
        email: "Correo electrónico no registrado.",
        success: "Se te ha enviado un correo electrónico con las instrucciones para recuperar la contraseña.",
        error: "Error al enviar el correo electrónico.",
    },
    en: {
        email: "Email not registered.",
        success: "An email has been sent to you with instructions to recover your password.",
        error: "Error sending the email.",
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