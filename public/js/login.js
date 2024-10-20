document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario

    const messages = {
        es: {
            success: "Inicio de sesión exitoso.",
            error: "Error al iniciar sesión.",
            user: "Nombre de usuario no registrado.",
            password: "Contraseña incorrecta."
        },
        en: {
            success: "Login successful.",
            error: "Error logging in.",
            user: "User name not registered.",
            password: "Incorrect password."
        }
    };

    const formData = new FormData(this);
    const data = {
        user: formData.get('user'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log(result);

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

        // Manejar las respuestas
        if (result.success) {
            // Mostrar alerta de éxito
            showAlert(result.msg, 'success');
            // Redirigir a la página principal
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);  // Redirigir después de 2 segundos
        } else {
            // Mostrar alerta de error
            showAlert(result.msg, 'danger');
        }
    } catch (error) {
        // Manejo de errores de conexión
        showAlert('error', 'danger');
    }
});
