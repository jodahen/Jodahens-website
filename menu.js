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

// Insert menu into page
document.addEventListener('DOMContentLoaded', () => {
    fetch('menu.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('menu-container').innerHTML = html;
        initMenu();
    });
});
