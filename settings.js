// Apply saved theme and sync checkbox
function applyTheme() {
    const theme = localStorage.getItem("theme") || "dark";
    const checkbox = document.getElementById("dark-mode-toggle");

    if(theme === "light") {
        document.body.style.background = "white";
        document.body.style.color = "black";
        if(checkbox) checkbox.checked = false;
    } else {
        document.body.style.background = "#0f172a";
        document.body.style.color = "white";
        if(checkbox) checkbox.checked = true;
    }
}

// Toggle dark/light theme via checkbox
function toggleTheme() {
    const checkbox = document.getElementById("dark-mode-toggle");
    localStorage.setItem("theme", checkbox.checked ? "dark" : "light");
    applyTheme();
}

// Font size
function changeFontSize(size) {
    document.body.style.fontSize = size + "px";
    localStorage.setItem("fontSize", size);
}

// Color scheme placeholder
function changeColorScheme(scheme) {
    localStorage.setItem("colorScheme", scheme);
    alert("Color scheme set to " + scheme);
}

// On page load, apply saved settings
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();

    const savedSize = localStorage.getItem("fontSize");
    if(savedSize) document.body.style.fontSize = savedSize + "px";
});
