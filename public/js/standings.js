// Función para cargar el ranking de usuarios
async function loadStandings() {
    try {
        // Hacer una llamada al servidor para obtener los standings
        const response = await fetch('/standings');
        const {users, usuarioActual} = await response.json();

        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('standings-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Rellenar la tabla con los usuarios
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</td>
                <td>${user.user}</td>
                <td>${user.points}</td>
            `;
            // Aplicar estilos en línea para los tres primeros puestos
            if (index === 0) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = 'rgba(255, 215, 0, 0.7)'); // Oro
            } else if (index === 1) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = 'rgba(192, 192, 192, 0.7)'); // Plata
            } else if (index === 2) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = 'rgba(205, 127, 50, 0.7)'); // Bronce
            }

            // Resaltar al usuario actual
            if (user.user === usuarioActual) {
                row.querySelectorAll('td').forEach(td => td.style.fontWeight = 'bold');
            }

            tableBody.appendChild(row);
        });

        // Inicializar DataTables después de llenar la tabla
        $('#standings').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            order: [], // Deshabilitar ordenamiento por defecto
            columnDefs: [
                { targets: 0, type: 'num' } // Asegura que la primera columna se ordene como número
            ],
            pageLength: 10, // Número de filas por página
        });
    } catch (error) {
        console.error('Error al cargar los standings:', error);
    }
}

// Cargar el ranking de usuarios cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadStandings);