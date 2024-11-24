let tarjetaIdToDelete = null;
const deleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')); // Crear instancia del modal

function deleteTarjeta(id) {
    tarjetaIdToDelete = id; // Guardar el ID de la tarjeta a eliminar
    deleteModal.show(); // Mostrar el modal
}

// Escuchar el clic en el botón de confirmación del modal
document.getElementById('confirmDeleteButton').addEventListener('click', () => {
    if (tarjetaIdToDelete) {
        fetch('/admin/tarjetas/' + tarjetaIdToDelete, {
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
            console.error('Error al eliminar la tarjeta:', error);
            showToast('delete_error', 'danger'); // Mostrar un toast de error
        })
        .finally(() => {
            tarjetaIdToDelete = null; // Reiniciar el ID después de la acción
            deleteModal.hide(); // Ocultar el modal
        });
    }
});