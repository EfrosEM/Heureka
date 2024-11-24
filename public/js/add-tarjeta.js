document.getElementById('addTarjetaForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar la recarga de la página

    // Obtener los valores del formulario
    const heuristica = document.getElementById('addHeuristica').value;
    const cumpleHeuristica = document.querySelector('input[name="flexRadioDefault"]:checked').id === 'flexRadioDefault1';
    const texto = document.getElementById('addTexto').value;
    const text = document.getElementById('addText').value;
    const imagen = document.getElementById('addImagen').files[0];

    // Crear el objeto FormData
    const formData = new FormData();
    formData.append('heuristica', heuristica);
    formData.append('esBuenEjemplo', cumpleHeuristica);
    formData.append('texto', texto);
    formData.append('text', text);
    formData.append('imagen', imagen);

    try {
        // Enviar la petición al servidor
        const response = await fetch('/admin/tarjetas', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        // Manejar las respuestas
        if (result.success) {
            // Guarda el mensaje en sessionStorage
            sessionStorage.setItem('toastMessage', 'add_success');
            sessionStorage.setItem('toastType', 'success');

            // Recargar la página
            location.reload();
        } else {
            showToast('add_error', 'danger');
        }

        // Limpiar el formulario
        document.getElementById('addTarjetaForm').reset();
    } catch (error) {
        console.error('Error al enviar la tarjeta:', error);
        showToast('add_error', 'danger');
    }
});

