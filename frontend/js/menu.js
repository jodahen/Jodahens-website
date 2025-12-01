// menu.js
function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if(menuBtn && menu){
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && e.target !== menuBtn) {
                menu.classList.remove("show");
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('menu-container');
    if (!container) return;

    fetch('menu.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;
            initMenu();
        });
});
