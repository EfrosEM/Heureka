async function loadHeader(){

    const headerNav = document.getElementById("nav");

    const response = await fetch('/users/profile');
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        const usuario = await response.json();

        const language = localStorage.getItem('selectedLanguage');

        if(usuario.rol === "PROFESOR") {
            const enlaceUsers = document.createElement('a');
            const enlaceTarjetas = document.createElement('a');

            if(language === 'en') {
                enlaceUsers.innerHTML = `
                    <i class="bi bi-person-vcard"></i> <span data-i18n="users">Users</span>
                `;
                enlaceTarjetas.innerHTML = `
                    <i class="bi bi-card-image"></i> <span data-i18n="cards">Game cards</span>
                `;
            }
            else if(language === 'es') {
                enlaceUsers.innerHTML = `
                    <i class="bi bi-person-vcard"></i> <span data-i18n="users">Usuarios</span>
                `;
                enlaceTarjetas.innerHTML = `
                    <i class="bi bi-card-image"></i> <span data-i18n="cards">Tarjetas</span>
                `;
            }
            enlaceUsers.href = "/users.html";
            enlaceTarjetas.href = "/tarjetas.html";
            
            // si es la pagina actual, se le agrega la clase active
            if(window.location.pathname.includes("users")) enlaceUsers.classList.add("active");
            if(window.location.pathname.includes("tarjetas")) enlaceTarjetas.classList.add("active");

            headerNav.appendChild(enlaceUsers);
            headerNav.appendChild(enlaceTarjetas);
        }
}

document.addEventListener('DOMContentLoaded', loadHeader);