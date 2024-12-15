document.addEventListener('DOMContentLoaded', function() {
    let translations = {};

    // Función para cargar el archivo de idioma y actualizar las traducciones
    function loadLanguage(lang) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    translations = JSON.parse(xhr.responseText);
                    translatePage();
                }
            }
        };
        xhr.open('GET', 'lang/' + lang + '.json');
        xhr.send();

        // Almacenar el idioma seleccionado en el almacenamiento local
        localStorage.setItem('selectedLanguage', lang);

        // Establecer el valor seleccionado del menú desplegable
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = lang;
        }
    }

    // Función para traducir el contenido de la página
    function translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    }

    // Obtener el idioma seleccionado del almacenamiento local
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';

    // Llama a la función de carga de idioma con el idioma seleccionado
    loadLanguage(selectedLang);

    // Llama a la función de carga de idioma cuando se cambia la selección del menú desplegable
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            loadLanguage(selectedLang);
        });
    }
});
