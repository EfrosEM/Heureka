const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");

const editUsernameInput = document.getElementById("editUsername");
const editEmailInput = document.getElementById("editEmail");
const editPasswordInput = document.getElementById("editPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

const messages = {
    es: {
      success: "Perfil actualizado correctamente.",
      found: "Usuario no encontrado.",
      name: "El nombre de usuario no puede superar los 30 caracteres.",
      password: "La contraseña debe tener al menos 5 caracteres.",
      confirm: "Las contraseñas introducidas no coinciden.",
      email: "Ese email ya ha sido registrado.",
      user: "Ese nombre de usuario ya está en uso.",
      error: "Error al editar el perfil."
    },
    en: {
      success: "Profile updated successfully.",
      found: "User not found.",
      name: "The username cannot exceed 30 characters.",
      password: "The password must have at least 5 characters.",
      confirm: "The passwords do not match.",
      email: "That email has already been registered.",
      user: "That user name is already in use.",
      error: "Error editing profile."
    }
};

// Prellenar los campos del modal con los datos actuales al abrir el modal
document.getElementById("editProfileModal").addEventListener("show.bs.modal", () => {
    editUsernameInput.value = usernameElement.textContent;
    editEmailInput.value = emailElement.textContent;
    editPasswordInput.value = ""; // Dejar en blanco para ingresar una nueva contraseña si se desea
});

// Guardar los cambios y actualizar el perfil
document.getElementById("editProfileForm").addEventListener("submit", function (event) {
    event.preventDefault();  // Prevenir el envío tradicional del formulario
    
    // Leer los nuevos valores del modal
    const newUsername = editUsernameInput.value;
    const newEmail = editEmailInput.value;
    const newPassword = editPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Enviar los datos al servidor si al menos uno de los campos no está vacío
    if (newUsername || newEmail || newPassword) {
        if (newPassword === confirmPassword) {
            actualizarUsuario(newUsername, newEmail, newPassword);
        } else {
            showAlert("confirm", 'danger');
            // Limpiar el formulario
            document.getElementById("editProfileForm").reset();
        }
    }

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
    modal.hide();
});

async function actualizarUsuario(newUser, newEmail, newPassword) {
    // Crear el objeto de datos a enviar
    const userData = {
        newUser: newUser,
        newEmail: newEmail,
        newPassword: newPassword
    };

    try {
        // Enviar los datos al servidor con una petición PUT
        const response = await fetch('/users/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        // Manejar las respuestas
        if (result.success) {
            // Mostrar alerta de éxito
            showAlert(result.msg, 'success');
            // Limpiar el formulario
            document.getElementById("editProfileForm").reset();

            // Actualizar la visualización de los datos
            if(newUser) usernameElement.textContent = newUser;
            if(newEmail) emailElement.textContent = newEmail;
        } else {
            // Mostrar alerta de error
            showAlert(result.msg, 'danger');
            // Limpiar el formulario
            document.getElementById("editProfileForm").reset();
        }

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        showAlert('error', 'danger');
    }
}

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
