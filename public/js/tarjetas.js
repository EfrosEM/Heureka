// Cargar tarjetas
async function loadTarjetas() {
    try {
        // Hacer una llamada al servidor para obtener las tarjetas
        const response = await fetch('/admin/tarjetas');
        const {tarjetas} = await response.json();
        
        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('tarjetas-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla
        
        const language = localStorage.getItem('selectedLanguage');

        // Rellenar la tabla con los usuarios
        tarjetas.forEach((tarjeta) => {
            const texto = language === 'en' ? tarjeta.text : tarjeta.texto;

            let icono = "";
            if(tarjeta.esBuenEjemplo){
                icono = '<h4><i class="bi bi-check-circle-fill text-success"></i></h4>';
            }
            else{
                icono = '<h4><i class="bi bi-x-circle-fill text-danger"></i></h4>';
            }

            const imagen = '<img src="' + tarjeta.imagen + '" class="img-thumbnail" alt="Imagen de la tarjeta" style="max-width: 200px; max-height: 200px;">';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${tarjeta.heuristica}</td>
                <td class="text-center">${texto}</td>
                <td class="text-center">${imagen}</td>
                <td class="text-center">${icono}</td>
            `;
            tableBody.appendChild(row);
        });
        
        // Inicializar DataTables después de llenar la tabla
        $('#tarjetas-table').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            pageLength: 5,
            lengthMenu: [5, 10, 20, 50],
            order: [], // Deshabilitar ordenamiento por defecto
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
        console.error('Error al cargar los usuarios:', error);
    }
}

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadTarjetas());