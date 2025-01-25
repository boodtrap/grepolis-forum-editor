// Functies voor het aanmaken van fora
function createForum(name, description, hidden) {
    console.log(`Forum aangemaakt: ${name}, ${description}, Verborgen: ${hidden}`);
    // Hier komt de logica om fora aan te maken
}

function initializePopup() {
    const existingPopup = document.querySelector('#forum-popup-container');
    if (existingPopup) return;

    const popup = document.createElement('div');
    popup.id = 'forum-popup-container';

    popup.innerHTML = `
        <h3>Grepolis Forum Editor</h3>
        <input type="text" id="forum-name" placeholder="Forumnaam">
        <input type="text" id="forum-description" placeholder="Forumomschrijving">
        <label>
            Verborgen
            <input type="checkbox" id="forum-hidden">
        </label>
        <button id="create-forum-btn">Forum Aanmaken</button>
    `;

    document.body.appendChild(popup);

    document.querySelector('#create-forum-btn').addEventListener('click', () => {
        const name = document.querySelector('#forum-name').value;
        const description = document.querySelector('#forum-description').value;
        const hidden = document.querySelector('#forum-hidden').checked;

        if (!name) {
            alert('Forumnaam is verplicht!');
            return;
        }

        createForum(name, description, hidden);
        document.body.removeChild(popup);
    });
}
