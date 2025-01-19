const messages = {
    es: {
        delete_success: "Usuario eliminado exitosamente.",
        delete_error: "Hubo un problema al eliminar el usuario.",
        delete_all_success: "Todos los usuarios han sido eliminados exitosamente.",
        delete_all_error: "Hubo un problema al eliminar los usuarios.",
        password_error: "Contraseña incorrecta.",
        edit_success: "Datos del usuario actualizados exitosamente.",
        edit_error: "Hubo un problema al actualizar los datos del usuario.",
    },
    en: {
        delete_success: "User deleted successfully.",
        delete_error: "There was a problem deleting the user.",
        delete_all_success: "All users have been deleted successfully.",
        delete_all_error: "There was a problem deleting the users.",
        password_error: "Incorrect password.",
        edit_success: "User data updated successfully.",
        edit_error: "There was a problem updating the user data.",
    }
};

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
    const language = localStorage.getItem('selectedLanguage');
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

// Cargar usuarios
async function loadUsers() {
    try {
        // Hacer una llamada al servidor para obtener los usuarios
        const response = await fetch('/admin/users');
        const {users} = await response.json();

        // Hacer una llamada al servidor para obtener el usuario actual
        const res = await fetch('/users/profile');
        const usuario = await res.json();

        // Obtener el cuerpo de la tabla
        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

        // Rellenar la tabla con los usuarios
        users.forEach((user) => {

            const barraPartidas = getBarraPartidas(user);
            const barraPreguntas = getBarraPreguntas(user);

            let botones ="";
            if(user.user != usuario.user) { // No mostrar botones para el usuario actual
                botones = `
                    <button class="btn btn-secondary btn-sm" onclick="editUser('${user._id}')">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">
                        <i class="bi bi-trash3-fill"></i>
                    </button>
                `;
            }

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
                <td class="text-center">${botones}</td>
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
                    targets: [8], type: 'time-uni', // Asegura que la columna de tiempo se ordene como número con formato
                    targets: [2], type: 'date',    // Asegura que la columna de fecha se ordene como fecha
                    orderable: false, targets: 9  // Deshabilitar ordenamiento en la columna de acciones
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

    if(horas < 10) horas = '0'+horas;
    if(minutos < 10) minutos = '0'+minutos;
    if(segundos < 10) segundos = '0'+segundos;

    let cadena = horas+':'+minutos+':'+segundos;


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