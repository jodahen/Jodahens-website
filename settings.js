// ===== SETTINGS.JS =====

// Apply saved theme on page load
function applyTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    if(theme === "light") {
        document.body.style.background = "white";
        document.body.style.color = "black";
    } else {
        document.body.style.background = "#0f172a";
        document.body.style.color = "white";
    }
}

// Toggle dark/light theme
function toggleTheme() {
    const current = localStorage.getItem("theme") || "dark";
    if(current === "light") {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
    applyTheme();
}

// Apply saved font size
function applyFontSize() {
    const size = localStorage.getItem("fontSize");
    if(size) document.body.style.fontSize = size + "px";
}

// Change font size
function changeFontSize(size) {
    document.body.style.fontSize = size + "px";
    localStorage.setItem("fontSize", size);
}

// Apply saved color scheme
function applyColorScheme() {
    const scheme = localStorage.getItem("colorScheme");
    if(scheme === "blue") {
        document.body.style.setProperty('--primary-color', '#38bdf8');
    } else if(scheme === "green") {
        document.body.style.setProperty('--primary-color', '#22c55e');
    } else {
        document.body.style.setProperty('--primary-color', '#38bdf8'); // default
    }
}

// Change color scheme
function changeColorScheme(scheme) {
    localStorage.setItem("colorScheme", scheme);
    applyColorScheme();
}

// Initialize all settings on page load
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    applyFontSize();
    applyColorScheme();
});
