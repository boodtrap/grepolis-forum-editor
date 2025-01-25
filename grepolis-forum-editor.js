// ==UserScript==
// @name         Grepolis Forum Editor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Beheer Grepolis-fora en topics eenvoudig met een geavanceerde editor
// @author       Boodtrap
// @match        *://*.grepolis.com/*
// @require      https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/scripts/forumEditor.js
// @require      https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/scripts/pagesManager.js
// @resource     CSS https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/styles/popup.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    // Voeg CSS toe aan de pagina
    const css = GM_getResourceText("CSS");
    GM_addStyle(css);

    // Start het script en voeg de popup toe
    initializePopup();

    // Functies worden geladen vanuit forumEditor.js en pagesManager.js
})();
