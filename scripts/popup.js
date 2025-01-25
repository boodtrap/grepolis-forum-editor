// Dynamisch laden van pagina-inhoud
function loadPage(pageName) {
    const contentContainer = document.querySelector('.content');
    const pageURL = `https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/pages/${pageName}.html`;

    fetch(pageURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Kan pagina ${pageName} niet laden.`);
            }
            return response.text();
        })
        .then(html => {
            contentContainer.innerHTML = html;
        })
        .catch(err => {
            contentContainer.innerHTML = `<p style="color: red;">Fout bij het laden van de pagina: ${err.message}</p>`;
        });
}

// Sluitknop functionaliteit
document.getElementById('close-popup').addEventListener('click', () => {
    document.body.style.display = 'none'; // Simuleert het sluiten van de popup
});

// Navigatieknoppen
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
        const pageName = button.getAttribute('data-page');
        loadPage(pageName);
    });
});
