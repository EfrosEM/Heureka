// Función para cargar el ranking de usuarios
async function loadStandings() {
    try {
        // Hacer una llamada al servidor para obtener los standings
        const response = await fetch('/standings');
        const users = await response.json();

        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('standings-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Rellenar la tabla con los usuarios
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.user}</td>
                <td>${user.points}</td>
            `;
            // Aplicar estilos en línea para los tres primeros puestos
            if (index === 0) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = 'gold');
            } else if (index === 1) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = 'silver');
            } else if (index === 2) {
                row.querySelectorAll('td').forEach(td => td.style.backgroundColor = '#cd7f32'); // Color bronce
            }
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los standings:', error);
    }
}

// Cargar el ranking de usuarios cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadStandings);