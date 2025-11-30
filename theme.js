function toggleTheme() {
    const current = localStorage.getItem("theme");

    if (current === "light") {
        localStorage.setItem("theme", "dark");
        document.body.style.background = '#0f172a';
        document.body.style.color = 'white';
    } else {
        localStorage.setItem("theme", "light");
        document.body.style.background = 'white';
        document.body.style.color = 'black';
    }
}

// On page load, apply saved theme
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem("theme") === "light") {
        document.body.style.background = 'white';
        document.body.style.color = 'black';
    }
});
