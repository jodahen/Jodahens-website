// theme.js
function applyTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    if (theme === "light") {
        document.body.style.background = 'white';
        document.body.style.color = 'black';
    } else {
        document.body.style.background = '#0f172a';
        document.body.style.color = 'white';
    }
}

function toggleTheme() {
    const current = localStorage.getItem("theme") || "dark";
    localStorage.setItem("theme", current === "light" ? "dark" : "light");
    applyTheme();
}

// Apply theme on page load
document.addEventListener("DOMContentLoaded", applyTheme);
