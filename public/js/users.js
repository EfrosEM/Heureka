// Cargar usuarios
async function loadUsers() {
    try {
        // Hacer una llamada al servidor para obtener los usuarios
        const response = await fetch('/admin/users');
        const {users} = await response.json();

        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Rellenar la tabla con los usuarios
        users.forEach((user) => {

            const barraPartidas = getBarraPartidas(user);
            const barraPreguntas = getBarraPreguntas(user);

            let rol = rolUsuario(user.rol);
            let fecha = new Date(user.alta);
            let tiempo = segundosToHHMMSS(user.time);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${user.user}</td>
                <td class="text-center">${user.email}</td>
                <td class="text-center">${fecha.toLocaleDateString()}</td>
                <td class="text-center">${rol}</td>
                <td class="text-center">${user.games}</td>
                <td class="text-center">${barraPartidas}</td>
                <td class="text-center">${user.preguntas}</td>
                <td class="text-center">${barraPreguntas}</td>
                <td class="text-center">${tiempo}</td>
            `;
            tableBody.appendChild(row);
        });

        // Inicializar DataTables después de llenar la tabla
        $('#user-table').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            pageLength: 10,
            order: [], // Deshabilitar ordenamiento por defecto
            columnDefs: [
                { 
                    targets: [4, 6], type: 'num',  // Asegura que las columnas de partidas y preguntas se ordenen como número
                    targets: [8], type: 'num-fmt', // Asegura que la columna de tiempo se ordene como número con formato
                    targets: [2], type: 'date'     // Asegura que la columna de fecha se ordene como fecha
                } 
            ],
            language: {
                entries: {
                    _: 'users',
                    1: 'user'
                }
            },
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

function segundosToHHMMSS(segundos) { 
    let horas = Math.trunc(segundos / 3600);
    segundos %= 3600;
    let minutos = Math.trunc(segundos / 60);
    segundos %= 60;

    let cadena = '';

    if(horas>0) {
        cadena += horas + 'h ';
    }
    if(minutos>0) {
        cadena += minutos + 'min ';
    }
    if(segundos>0) {
        cadena += segundos + 's';
    }
    if(horas === 0 && minutos === 0 && segundos === 0) {
        cadena += '0s';
    }

    return cadena;
}

function getBarraPartidas(user) {

    let barraPartidas = '';

    // Calcular porcentajes de partidas ganadas y perdidas
    const totalGames = user.games;
    const wins = user.wins;
    const losses = totalGames - wins;
    const winPercentage = (wins / totalGames) * 100;
    const lossPercentage = (losses / totalGames) * 100;
    
    if (totalGames > 0) {
        barraPartidas = `
            <div class="progress" style="margin-top: 4px">
                <div class="progress-bar" role="progressbar" aria-label="Victorias" style="width: ${winPercentage}%">
                ${wins}W
                </div>
                <div class="progress-bar bg-danger" role="progressbar" aria-label="Derrotas" style="width: ${lossPercentage}%">
                ${losses}L
                </div>
            </div>`;
    }
    else {
        barraPartidas = `
            <div class="progress" style="margin-top: 4px">
                <div class="progress-bar" role="progressbar" aria-label="Victorias">
                </div>
                <div class="progress-bar bg-danger" role="progressbar" aria-label="Derrotas">
                </div>
            </div>`;
    }

    return barraPartidas;
}

function getBarraPreguntas(user) {

    let barraPreguntas = '';

    // Calcular porcentajes de fallos y aciertos
    const totalPreguntas = user.preguntas;
    const aciertos = user.aciertos;
    const fallos = totalPreguntas - aciertos;
    const aciertoPercentage = (aciertos / totalPreguntas) * 100;
    const falloPercentage = (fallos / totalPreguntas) * 100;

    if (totalPreguntas > 0) {
        barraPreguntas = `
            <div class="progress" style="margin-top: 4px">
                <div class="progress-bar" role="progressbar" aria-label="Aciertos" style="width: ${aciertoPercentage}%">
                ${aciertos}R
                </div>
                <div class="progress-bar bg-danger" role="progressbar" aria-label="Fallos" style="width: ${falloPercentage}%">
                ${fallos}W
                </div>
            </div>`;
    }
    else {
        barraPreguntas = `
            <div class="progress" style="margin-top: 4px">
                <div class="progress-bar" role="progressbar" aria-label="Aciertos">
                </div>
                <div class="progress-bar bg-danger" role="progressbar" aria-label="Fallos">
                </div>
            </div>`;
    }

    return barraPreguntas;
}

function rolUsuario(rolUser) {
    // Mostrar el rol del usuario
    let rol = '';
    const language = localStorage.getItem('selectedLanguage');

    if(rolUser === 'ALUMNO') {
        if(language === 'en') {
            rol = '<span class="badge bg-success-subtle border border-success-subtle text-success-emphasis" data-i18n="alumno">STUDENT</span>'
        }
        else if(language === 'es') {
            rol = '<span class="badge bg-success-subtle border border-success-subtle text-success-emphasis" data-i18n="alumno">ALUMNO</span>'
        }
    }
    else if(rolUser === 'PROFESOR') {
        if(language === 'en') {
            rol = '<span class="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis" data-i18n="profesor">TEACHER</span>'
        }
        else if(language === 'es') {
            rol = '<span class="badge bg-primary-subtle border border-primary-subtle text-primary-emphasis" data-i18n="profesor">PROFESOR</span>'
        }
    }
    return rol;
}

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', loadUsers());