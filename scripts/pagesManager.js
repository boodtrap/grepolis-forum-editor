function loadPage(pageName) {
    fetch(`https://raw.githubusercontent.com/boodtrap/grepolis-forum-editor/main/pages/${pageName}.html`)
        .then(response => response.text())
        .then(html => {
            document.querySelector('#forum-popup-container .content').innerHTML = html;
        })
        .catch(err => console.error(`Error loading page: ${pageName}`, err));
}
