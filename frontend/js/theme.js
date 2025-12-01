// theme.js
document.addEventListener("DOMContentLoaded", () => {
    const darkMode = localStorage.getItem("theme") === "dark";
    document.body.style.background = darkMode ? "#0f172a" : "white";
    document.body.style.color = darkMode ? "white" : "black";
});

function toggleDarkMode() {
    const isDark = document.body.style.background === "white";
    document.body.style.background = isDark ? "#0f172a" : "white";
    document.body.style.color = isDark ? "white" : "black";
    localStorage.setItem("theme", isDark ? "dark" : "light");
}
