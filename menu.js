function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if(menuBtn && menu){
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menu.classList.toggle("show");
        });

        document.addEventListener("click", () => {
            menu.classList.remove("show");
        });
    }
}

// Initialize menu after it's inserted in the DOM
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('menu-container');
    if(container && container.innerHTML.trim() !== '') {
        initMenu();
    }
});
