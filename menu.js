// menu.js
function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if(menuBtn && menu){
        // Toggle menu only when button clicked
        menuBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            menu.classList.toggle("show");
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && e.target !== menuBtn) {
                menu.classList.remove("show");
            }
        });
    }
}

// Insert menu into page
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('menu-container');
    if(!container) return;

    // Insert menu HTML
    fetch('menu.html')
        .then(res => res.text())
        .then(html => {
            container.innerHTML = html;

            // Ensure menu is hidden initially
            const menuEl = document.getElementById("menu");
            if(menuEl) menuEl.classList.remove("show");

            // Initialize menu functionality
            initMenu();
        });
});
