// ==UserScript==
// @name         Grepolis Forum Editor
// @namespace    https://github.com/boodtrap/grepolis-forum-editor
// @version      0.6
// @description  Voeg een knop, pop-up en werkbalk toe aan Grepolis om het forum te bewerken
// @author       Boodtrap
// @match        *://*.grepolis.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let currentPage = 'main'; // Huidige pagina (main of forum-generator)
    let forumsCreated = false; // Controleer of forums zijn aangemaakt

    // Array met standaard forums
    const forumOptions = [
        'Algemeen',
        'Rood',
        'Deff',
        'Off',
        'MA',
        'IO\'s',
        'Cluster',
        'Kroeg',
        'Leiding'
    ];

    // Voeg CSS toe via het script
    const style = document.createElement('style');
    style.textContent = `
        /* Button stijl */
        #forum-button {
            position: fixed;
            bottom: 55px;
            left: 20px;
            width: 50px;
            height: 50px;
            background-image: url('https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/img/Buttons/toolbar-buttons/admin_2-removebg-preview.png');
            background-size: cover;
            background-repeat: no-repeat;
            border: none;
            cursor: pointer;
            z-index: 1000;
        }

        /* Pop-up stijl */
        #forum-popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 60%;
            background-image: url('https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/img/Background/Background.jpg');
            background-size: cover;
            background-repeat: no-repeat;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
            z-index: 1001;
            border-radius: 10px;
            padding: 20px;
        }

        /* Tekst stijl */
        #forum-popup h1 {
            margin-top: 145px;
            color: #000000;
            font-size: 48px;
            font-family: Arial, sans-serif;
        }

        #forum-popup p {
            margin-top: 5px;
            color: #000000;
            font-size: 24px;
            font-family: Arial, sans-serif;
        }

        /* Werkbalk stijl */
        #toolbar {
            position: absolute;
            top: 105px;
            left: 0;
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: flex-start; /* Iconen beginnen vanaf de linkerkant */
            gap: 10px;
            background-color: rgba(0, 0, 0, 0.7); /* Donkere achtergrond */
            padding: 5px 10px; /* Ruimte rond iconen */
            border-radius: 5px; /* Afronding */
        }

        #toolbar img {
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        #toolbar img:hover {
            transform: scale(1.2); /* Vergroot icoon bij hover */
        }

        #close-popup {
            width: 30px;
            height: 30px;
            background-color: red;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            line-height: 30px;
        }

        .welcome-text {
            text-align: center;
            font-size: 20px;
            color: #333;
        }

        .welcome-text {
            text-align: center;
            font-size: 20px;
            color: #333;
        }

        .forum-generator {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .forum-generator label,
        .forum-generator select,
        .forum-generator input {
            font-size: 16px;
        }

        .forum-generator button {
            padding: 10px 15px;
            background-color: #4caf50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .forum-generator button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);

    // Voeg de hoofd-knop toe
    const button = document.createElement('button');
    button.id = 'forum-button';
    document.body.appendChild(button);

   // Voeg de pop-up toe
    const popup = document.createElement('div');
    popup.id = 'forum-popup';
    popup.innerHTML = `
        <div id="toolbar">
            <div style="display: flex; gap: 10px;">
                <img id="main-icon" src="https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/img/Buttons/toolbar-buttons/admin_1-removebg-preview.png" alt="Main">
                <img id="forum-generator-icon" src="https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/img/Buttons/toolbar-buttons/cluster_1-removebg-preview.png" alt="Forum Generator">
            </div>
            <button id="close-popup">X</button>
        </div>
        <div id="popup-content"></div>
    `;
    document.body.appendChild(popup);

    // Functie om de inhoud van de pop-up te updaten
    function updatePopupContent() {
        const content = document.getElementById('popup-content');
        if (currentPage === 'main') {
            content.innerHTML = `
                <h1 class="welcome-text">Welkom bij de Grepolis Forum Editor</h1>
                <p class="welcome-text">
                    Gebruik deze tool om forums en sub-forums aan te maken en je Grepolis-ervaring te verbeteren.
                </p>
            `;
        } else if (currentPage === 'forum-generator') {
            content.innerHTML = `
                <h1>Forum Generator</h1>
                <div class="forum-generator">
                    <label for="forum-dropdown">Selecteer een standaard forum:</label>
                    <select id="forum-dropdown" multiple></select>
                    <label for="custom-forum">Eigen forum:</label>
                    <input id="custom-forum" type="text" placeholder="Naam van eigen forum">
                    <button id="create-forums">Maak forums aan</button>
                </div>
            `;

            // Laad de forum-opties dynamisch
            const dropdown = document.getElementById('forum-dropdown');
            forumOptions.forEach((forum) => {
                const option = document.createElement('option');
                option.value = forum;
                option.textContent = forum;
                dropdown.appendChild(option);
            });

            // Voeg event toe aan de aanmaak-knop
            document.getElementById('create-forums').addEventListener('click', createForums);
        }
    }

    // Functie om forums aan te maken
    function createForums() {
        const dropdown = document.getElementById('forum-dropdown');
        const customForum = document.getElementById('custom-forum').value.trim();

        let forums = Array.from(dropdown.selectedOptions).map((opt) => opt.value);
        if (customForum) forums.push(customForum);

        if (forums.length === 0) {
            alert('Selecteer minstens één forum of maak een eigen forum aan.');
            return;
        }

        forumsCreated = true;
        alert(`De volgende forums zijn aangemaakt: ${forums.join(', ')}`);

        // Ga terug naar de hoofdpagina
        currentPage = 'main';
        updatePopupContent();

        // Toon iconen voor de forums
        const toolbarIcons = document.querySelectorAll('#toolbar img.hidden');
        toolbarIcons.forEach((icon) => icon.classList.remove('hidden'));

        // Ga terug naar de hoofdpagina
        currentPage = 'main';
        updatePopupContent();
    }

    // Event listener voor hoofd-knop
    button.addEventListener('click', () => {
        popup.style.display = 'block';
        updatePopupContent();
    });

    // Event listeners voor toolbar-iconen
    document.getElementById('main-icon').addEventListener('click', () => {
        currentPage = 'main';
        updatePopupContent();
    });

    document.getElementById('forum-generator-icon').addEventListener('click', () => {
        currentPage = 'forum-generator';
        updatePopupContent();
    });

    // Sluit de pop-up bij klikken op de sluitknop
    document.getElementById('close-popup').addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Toon de pop-up bij klikken
    document.body.addEventListener('click', (e) => {
        if (e.target.id === 'forum-generator-icon') {
            currentPage = 'forum-generator';
            popup.style.display = 'block';
            updatePopupContent();
        }
    });
})();
