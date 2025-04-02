let userToEdit = null;
const editModal = new bootstrap.Modal(document.getElementById('editUserModal')); // Crear instancia del modal
const editUsernameInput = document.getElementById("editUsername");
const editEmailInput = document.getElementById("editEmail");
const editPointsInput = document.getElementById("editPoints");
const editRolSelect = document.getElementById("editRol");

async function editUser(userID) {

    // Obtener los datos del usuario a editar
    const response = await fetch(`/admin/user/${userID}`);
    const data = await response.json();
    userToEdit = data.user;

    editModal.show(); // Mostrar el modal
}

// Prellenar los campos del modal con los datos actuales al abrir el modal
document.getElementById("editUserModal").addEventListener("show.bs.modal", () => {
    editUsernameInput.value = userToEdit.user;
    editEmailInput.value = userToEdit.email;
    editPointsInput.value = userToEdit.points;
    editRolSelect.value = userToEdit.rol;
});

// Escuchar el clic en el botón de confirmación del modal de editar
document.getElementById('saveUserButton').addEventListener('click', (event) => {
    event.preventDefault(); // Previene la recarga predeterminada del formulario

    const user = editUsernameInput.value;
    const email = editEmailInput.value;
    const points = editPointsInput.value;
    const rol = editRolSelect.value;

    if (userToEdit){
        fetch(`/admin/user/${userToEdit._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user, email, points, rol })
        })
        .then(res => {
            if (res.ok) {
                // Guarda el mensaje en sessionStorage
                sessionStorage.setItem('toastMessage', 'edit_success');
                sessionStorage.setItem('toastType', 'success');

                // Reiniciar usuario después de la acción
                userToEdit = null; 

                // Recargar la página
                location.reload();
            } else {
                console.error('Error al guardar:', errorData);
                showToast('edit_error', 'danger'); // Mostrar un toast de error
            }
        })
        .catch(error => {
            console.error('Error al editar el usuario:', error);
            showToast('edit_error', 'danger'); // Mostrar un toast de error
        });
    }
});