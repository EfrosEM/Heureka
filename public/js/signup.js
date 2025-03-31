//const { USERNAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } = require('../../config/config.js');
// FIXME
const USERNAME_MAX_LENGTH = 30; // Máximo de caracteres para el nombre de usuario
const PASSWORD_MIN_LENGTH = 8; // Mínimo de caracteres para la contraseña

// Escuchar el evento submit del formulario
document.getElementById('signup-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario

    const messages = {
      es: {
        success: "Usuario registrado correctamente.",
        fields: "Por favor, llena todos los campos.",
        name: `El nombre de usuario no puede superar los ${USERNAME_MAX_LENGTH} caracteres.`,
        password: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
        email: "Ese email ya ha sido registrado.",
        user: "Ese nombre de usuario ya está en uso.",
        connection: "Ocurrió un error en el registro.",
        error: "Error al registrar usuario."
      },
      en: {
        success: "User registered successfully.",
        fields: "Please fill in all the fields.",
        name: `The username cannot exceed ${USERNAME_MAX_LENGTH} characters.`,
        password: `The password must have at least ${PASSWORD_MIN_LENGTH} characters.`,
        email: "That email has already been registered.",
        user: "That user name is already in use.",
        connection: "An error occurred while signing up.",
        error: "Error signing up user."
      }
    };

    // Función para mostrar la alerta
    function showAlert(messageKey, type) {
      const language = document.getElementById('language-select').value;
      const message = messages[language][messageKey];

      let icon = "";
      if(type == "success"){
        icon = `<i class="bi bi-check-circle-fill"></i>`;
      }else{
        icon = `<i class="bi bi-exclamation-triangle-fill"></i>`;
      }

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

    // Obtener los datos del formulario
    const formData = new FormData(this);
    const data = {
        user: formData.get('user'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
      // Enviar los datos por AJAX
      const response = await fetch('/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Manejar las respuestas
      if (result.success) {
        // Mostrar alerta de éxito
        showAlert(result.msg, 'success');
        // Limpiar el formulario después del éxito
        this.reset();
      } else {
        // Mostrar alerta de error
        showAlert(result.msg, 'danger');
      }
    } catch (error) {
      // Manejo de errores de conexión
      console.error("Error en el registro:", error);
      showAlert('connection', 'danger');
    }
});