// settings.js
// Global site settings manager

const defaultSettings = {
    theme: "dark",      // "dark" or "light"
    fontSize: "16",     // in px
    color: "blue",      // "blue" or "green"
    motion: "on",       // "on" or "off"
    sound: "on"         // "on" or "off"
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
    const darkToggle = document.getElementById("darkToggle");
    if (loadSetting("theme") === "light") {
        document.body.style.background = "white";
        document.body.style.color = "black";
        if(darkToggle) darkToggle.checked = false;
        if(darkToggle) darkToggle.nextSibling.textContent = " 🌙 Dark Mode";
    } else {
        document.body.style.background = "#0f172a";
        document.body.style.color = "white";
        if(darkToggle) darkToggle.checked = true;
        if(darkToggle) darkToggle.nextSibling.textContent = " ☀ Light Mode";
    }

    // ---- FONT SIZE ----
    document.body.style.fontSize = loadSetting("fontSize") + "px";
    const fontSizeSelect = document.getElementById("font-size");
    if(fontSizeSelect) fontSizeSelect.value = loadSetting("fontSize");

    // ---- COLOR SCHEME ----
    const color = loadSetting("color");
    const colorSelect = document.getElementById("color-scheme");
    if(colorSelect) colorSelect.value = color;

    let accent = "#38bdf8"; // default blue
    if(color === "green") accent = "#22c55e";
    document.documentElement.style.setProperty("--accent", accent);

    // ---- MOTION ----
    if (loadSetting("motion") === "off") {
        document.body.classList.add("reduce-motion");
    } else {
        document.body.classList.remove("reduce-motion");
    }

    const motionToggle = document.getElementById("motion-toggle");
    if(motionToggle) motionToggle.checked = loadSetting("motion") === "on";

    // ---- SOUND ----
    const soundToggle = document.getElementById("sound-toggle");
    if(soundToggle) soundToggle.checked = loadSetting("sound") === "on";
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

// Sound toggle
function toggleSound(enabled) {
    saveSetting("sound", enabled ? "on" : "off");
    applySettings();
}

/* ===========================
   ON PAGE LOAD
=========================== */

document.addEventListener("DOMContentLoaded", () => {
    applySettings();
});
