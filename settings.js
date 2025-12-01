// settings.js
// Global site settings manager

const defaultSettings = {
    theme: "dark",
    fontSize: "16",
    color: "blue",
    motion: "on",
    sound: "on"
};

/* ===========================
   Storage helpers
=========================== */

function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

function loadSetting(key) {
    return localStorage.getItem(key) || defaultSettings[key];
}

/* ===========================
   Apply ALL settings
=========================== */

function applySettings() {

    // ---- THEME ----
    if (loadSetting("theme") === "light") {
        document.body.style.background = "white";
        document.body.style.color = "black";
    } else {
        document.body.style.background = "#0f172a";
        document.body.style.color = "white";
    }

    // ---- FONT SIZE ----
    document.body.style.fontSize = loadSetting("fontSize") + "px";

    // ---- COLOR SCHEME ----
    const color = loadSetting("color");

    let accent = "#38bdf8"; // default blue
    if (color === "green") accent = "#22c55e";

    document.documentElement.style.setProperty("--accent", accent);

    // ---- MOTION ----
    if (loadSetting("motion") === "off") {
        document.body.classList.add("reduce-motion");
    } else {
        document.body.classList.remove("reduce-motion");
    }
}

/* ===========================
   CONTROLS
=========================== */

// Dark Mode Toggle
function toggleDarkMode() {
    const current = loadSetting("theme");
    saveSetting("theme", current === "light" ? "dark" : "light");
    applySettings();
}

// Font size selector
function changeFontSize(size) {
    saveSetting("fontSize", size);
    applySettings();
}

// Color scheme selector
function changeColorScheme(color) {
    saveSetting("color", color);
    applySettings();
}

// Motion toggle
function toggleMotion(enabled) {
    saveSetting("motion", enabled ? "on" : "off");
    applySettings();
}

// Sound toggle (for future games)
function toggleSound(enabled) {
    saveSetting("sound", enabled ? "on" : "off");
}

/* ===========================
   ON PAGE LOAD
=========================== */

document.addEventListener("DOMContentLoaded", () => {

    applySettings();

    // Sync dark mode checkbox (if it exists on the page)
    const darkToggle = document.getElementById("darkToggle");
    if (darkToggle) {
        darkToggle.checked = loadSetting("theme") === "dark";
    }

    // Sync font-size dropdown
    const fontSizeSelect = document.getElementById("font-size");
    if (fontSizeSelect) {
        fontSizeSelect.value = loadSetting("fontSize");
    }

    // Sync color scheme dropdown
    const colorSelect = document.getElementById("color-scheme");
    if (colorSelect) {
        colorSelect.value = loadSetting("color");
    }
});
