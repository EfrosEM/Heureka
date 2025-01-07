async function loadLevels() {
    const intermediate = document.getElementById("intermediate");
    const advanced = document.getElementById("advanced");
    const intermediateIcon = document.getElementById("intermediate-icon");
    const advancedIcon = document.getElementById("advanced-icon");

    try {
        const response = await fetch('/users/profile');
        if (!response.ok) {
            throw new Error('No autorizado');
        }
        const usuario = await response.json();

        // Deshabilitar los niveles según el nivel del usuario
        if (usuario.nivel === "PRINCIPIANTE") {
            intermediate.disabled = true;
            intermediateIcon.classList.add("icon-disabled");
            intermediateIcon.classList.remove("text-warning");
            advanced.disabled = true;
            advancedIcon.classList.add("icon-disabled");
            advancedIcon.classList.remove("text-danger");
        } else if (usuario.nivel === "INTERMEDIO") {
            intermediate.disabled = false;
            advanced.disabled = true;
            advancedIcon.classList.add("icon-disabled");
            advancedIcon.classList.remove("text-danger");
        } else if (usuario.nivel === "AVANZADO") {
            intermediate.disabled = false;
            advanced.disabled = false;
        }
    } catch (error) {
        console.error('Error al cargar los niveles:', error);
    }
}

// Ejecutar la función cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', loadLevels);
