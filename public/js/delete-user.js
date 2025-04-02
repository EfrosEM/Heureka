let userIdToDelete = null;
const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')); // Crear instancia del modal
const deleteAllModal = document.getElementById('deleteUsersModal');
const contraseña = document.getElementById('password');

// Poner en blanco el campo contraseña cada vez que se abre el modal
deleteAllModal.addEventListener("show.bs.modal", () => {
    contraseña.value = "";
});

function deleteUser(id) {
    userIdToDelete = id; // Guardar el ID del usuario a eliminar
    deleteModal.show(); // Mostrar el modal
}

async function deleteAllUsers() {
    // Hacer una llamada al servidor para comprobar que la contraseña es la del usuario autenticado
    const response = await fetch('/users/check-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: contraseña.value })
    });

    if (response.ok) {
        fetch('/admin/users', {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Guarda el mensaje en sessionStorage
                sessionStorage.setItem('toastMessage', 'delete_all_success');
                sessionStorage.setItem('toastType', 'success');

                // Recargar la página
                location.reload();
            } else {
                showToast('delete_all_error', 'danger'); // Mostrar un toast de error
            }
        })
        .catch(error => {
            console.error('Error al eliminar todos los usuarios:', error);
            showToast('delete_all_error', 'danger'); // Mostrar un toast de error
        })
    }
    else {
        showToast('password_error', 'danger'); // Mostrar un toast de error
    }
}

// Escuchar el clic en el botón de confirmación del modal de eliminar
document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    if (userIdToDelete) {
        fetch('/admin/user/' + userIdToDelete, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Guarda el mensaje en sessionStorage
                sessionStorage.setItem('toastMessage', 'delete_success');
                sessionStorage.setItem('toastType', 'success');

                // Recargar la página
                location.reload();
            } else {
                showToast('delete_error', 'danger'); // Mostrar un toast de error
            }
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
            showToast('delete_error', 'danger'); // Mostrar un toast de error
        })
        .finally(() => {
            userIdToDelete = null; // Reiniciar el ID después de la acción
            deleteModal.hide(); // Ocultar el modal
        });
    }
});

// Escuchar el clic en el botón de confirmación del modal de eliminar todos
document.getElementById('confirmDeleteAllButton').addEventListener('click', deleteAllUsers);