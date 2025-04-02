const messages = {
    es: {
        delete_success: "Tarjeta eliminada exitosamente.",
        delete_error: "Hubo un problema al eliminar la tarjeta.",
        add_success: "Tarjeta creada exitosamente.",
        add_error: "Hubo un problema al crear la tarjeta."
    },
    en: {
        delete_success: "Game card deleted successfully.",
        delete_error: "There was a problem deleting the game card.",
        add_success: "Game card created successfully.",
        add_error: "There was a problem creating the game card."
    }
};

const language = localStorage.getItem('selectedLanguage');

// Verifica si hay un mensaje en sessionStorage
const toastMessage = sessionStorage.getItem('toastMessage');
const toastType = sessionStorage.getItem('toastType');

if (toastMessage) {
    // Muestra el toast con el mensaje almacenado
    showToast(toastMessage, toastType);
  
    // Limpia el mensaje para que no se repita
    sessionStorage.removeItem('toastMessage');
    sessionStorage.removeItem('toastType');
}

function showToast(messageKey, type) {
    // Obtiene el mensaje según el idioma
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
    const toast = new bootstrap.Toast(toastDiv, { autohide: true, delay: 10000 });
    toast.show();

    // Eliminamos el toast del DOM cuando desaparezca
    toastDiv.addEventListener('hidden.bs.toast', () => {
        toastDiv.remove();
    });
}

// Cargar tarjetas
async function loadTarjetas() {
    try {
        // Hacer una llamada al servidor para obtener las tarjetas
        const response = await fetch('/admin/tarjetas');
        const {tarjetas} = await response.json();
        
        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('tarjetas-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        let n = 0;

        // Rellenar la tabla con las tarjetas
        tarjetas.forEach((tarjeta) => {
            const texto = language === 'en' ? tarjeta.text : tarjeta.texto;


            let icono = "";
            if(tarjeta.esBuenEjemplo){
                icono = '<i class="bi bi-check-circle-fill text-success h2"></i>';
            }
            else{
                icono = '<i class="bi bi-x-circle-fill text-danger h2"></i>';
            }

            const imagen = '<img src="' + tarjeta.imagen + '" class="img-thumbnail" alt="Imagen de la tarjeta '+n+'" style="max-width: 200px; max-height: 200px;">';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${tarjeta.heuristica}</td>
                <td class="text-center">${texto}</td>
                <td class="text-center">${icono}</td>
                <td class="text-center">${imagen}</td>
                <td class="text-center"><button class="btn btn-danger" onclick="deleteTarjeta('${tarjeta._id}')" aria-label="Borrar tarjeta"><i class="bi bi-trash3-fill"></i></button></td>
            `;
            tableBody.appendChild(row);
            n++;
        });
        
        // Inicializar DataTables después de llenar la tabla
        $('#tarjetas-table').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            pageLength: 3,
            lengthMenu: [3, 5, 10, 20, 50],
            order: [], // Deshabilitar ordenamiento por defecto
            columnDefs: [
                { targets: 2, type: 'string' } // Asegura que la columna de iconos se ordene como texto
            ],
            layout: {
                topEnd: {
                    search: {
                        text: '<i class="bi bi-search"></i> _INPUT_',
                        placeholder: 'Search...'
                    }
                },
            }
        });

    } catch (error) {
        console.error('Error al cargar las tarjetas:', error);
    }
}

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadTarjetas());