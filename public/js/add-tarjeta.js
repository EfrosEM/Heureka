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
            showToast('success', 'success');
        } else {
            showToast('error', 'danger');
        }

        // Limpiar el formulario
        document.getElementById('addTarjetaForm').reset();
    } catch (error) {
        console.error('Error al enviar la tarjeta:', error);
        showToast('error', 'danger');
    }
});

const messages = {
    es: {
        success: "Tarjeta creada exitosamente.",
        error: "Hubo un problema al crear la tarjeta."
    },
    en: {
        success: "Game card created successfully.",
        error: "There was a problem creating the game card.",
    }
};

function showToast(messageKey, type) {
    // Obtenemos el idioma actual seleccionado
    const language = document.getElementById('language-select').value;
    const message = messages[language][messageKey];

    let icon = "";
    if (type == "success") {
        icon = `<i class="bi bi-check-circle"></i>`;
    } else {
        icon = `<i class="bi bi-exclamation-triangle"></i>`;
    }

    // Creamos el elemento del toast
    const toastDiv = document.createElement('div');
    toastDiv.className = `toast text-bg-${type}`;
    toastDiv.role = 'alert';
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');

    // HTML del toast
    toastDiv.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${icon} ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    // Añadimos el toast al contenedor de toasts
    const toastContainer = document.getElementById('toast-container');
    toastContainer.appendChild(toastDiv);

    // Iniciamos el toast con Bootstrap
    const toast = new bootstrap.Toast(toastDiv, { autohide: true, delay: 5000 });
    toast.show();
}

