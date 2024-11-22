async function loadHeader(){

    const headerNav = document.getElementById("nav");

    const response = await fetch('/users/profile');
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        const usuario = await response.json();

        const language = localStorage.getItem('selectedLanguage');

        if(usuario.rol === "PROFESOR") {
            const enlace = document.createElement('a');

            if(language === 'en') {
                enlace.innerHTML = `
                    <i class="bi bi-people"></i> <span data-i18n="users">Users</span>
                `;
            }
            else if(language === 'es') {
                enlace.innerHTML = `
                    <i class="bi bi-people"></i> <span data-i18n="users">Usuarios</span>
                `;
            }
            enlace.href = "/users.html";
            
            // si la pagina actual es la de usuarios, se le agrega la clase active
            if(window.location.pathname.includes("users")) enlace.classList.add("active");

            headerNav.appendChild(enlace);
        }
}

document.addEventListener('DOMContentLoaded', loadHeader);