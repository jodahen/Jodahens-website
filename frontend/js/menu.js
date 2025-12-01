// menu.js
function initMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const menu = document.getElementById("menu");

    if (!menuBtn || !menu) return;

    // Toggle menu on button click
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("show");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== menuBtn) {
            menu.classList.remove("show");
        }
    });
}

// Insert menu into page
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("menu-container");
    if (!container) return;

    fetch("menu.html")
        .then((res) => res.text())
        .then((html) => {
            container.innerHTML = html;
            const menuEl = document.getElementById("menu");
            if (menuEl) menuEl.classList.remove("show"); // ensure hidden
            initMenu(); // initialize functionality
        })
        .catch((err) => console.error("Menu load error:", err));
});
