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

document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById("startGame");
  
    startGameButton.addEventListener("click", () => {
      // Seleccionar el nivel
      const selectedLevel = document.querySelector('input[name="engine"]:checked');
  
      if (selectedLevel) {
        // Determinar la página de redirección según el nivel seleccionado
        let targetPage = "";
        switch (selectedLevel.id) {
          case "beginner":
            targetPage = "/game.html";
            break;
          case "intermediate":
            targetPage = "/game-intermediate.html";
            break;
          case "advanced":
            targetPage = "/game-advanced.html";
            break;
          default:
            alert("Selecciona un nivel válido.");
            return;
        }
  
        // Redirigir a la página correspondiente
        window.location.href = targetPage;
      } else {
        alert("Por favor, selecciona un nivel de dificultad antes de comenzar.");
      }
    });
  });  

// Ejecutar la función cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', loadLevels);
