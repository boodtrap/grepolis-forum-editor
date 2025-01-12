// ==UserScript==
// @name         Grepolis Forum Editor
// @namespace    https://github.com/boodtrap/grepolis-forum-editor
// @version      0.1
// @description  Aanpassen van het Grepolis-forum via een Tampermonkey-script
// @author       Boodtrap
// @match        *://*.grepolis.com/*
// @grant        GM_addStyle
// @require      https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/public/style.css
// ==/UserScript==

(function () {
    'use strict';

    // Voeg de knop toe
    const button = document.createElement('button');
    button.id = 'forum-button';
    document.body.appendChild(button);

    // Voeg de pop-up toe
    const popup = document.createElement('div');
    popup.id = 'forum-popup';
    popup.innerHTML = `
        <button id="close-popup">X</button>
        <h1>Grepolis Forum Editor</h1>
        <p>Hier kun je aanpassingen maken voor het forum.</p>
    `;
    document.body.appendChild(popup);

    // Open pop-up bij klikken op knop
    button.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    // Sluit pop-up bij klikken op sluitknop
    document.getElementById('close-popup').addEventListener('click', () => {
        popup.style.display = 'none';
    });
})();
