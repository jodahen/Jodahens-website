// settings.js
// Global site settings manager with backend support

/* ===========================
   Fetch & Save Settings
=========================== */
async function fetchSettings() {
    try {
        const res = await fetch("http://localhost:3000/api/user/settings", {
            credentials: "include"
        });
        if(res.ok) return await res.json();
    } catch(err){ console.error("Fetch settings error:", err); }
    return null;
}

async function saveSettings(settings) {
    try {
        const res = await fetch("http://localhost:3000/api/user/settings", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings)
        });
        if(!res.ok) console.error(await res.text());
    } catch(err){ console.error("Save settings error:", err); }
}

/* ===========================
   Apply Settings Locally
=========================== */
document.addEventListener("DOMContentLoaded", async () => {
    const darkToggle = document.getElementById("darkToggle");
    const fontSizeSelect = document.getElementById("font-size");
    const colorSelect = document.getElementById("color-scheme");
    const motionToggle = document.getElementById("motion-toggle");
    const soundToggle = document.getElementById("sound-toggle");

    // Default settings if backend not available
    let settings = await fetchSettings() || { 
        theme:"dark", fontSize:"16", color:"blue", motion:"on", sound:"on" 
    };

    // Apply settings immediately
    applySettings(settings);

    // Sync controls
    if(darkToggle) darkToggle.checked = settings.theme==="dark";
    if(fontSizeSelect) fontSizeSelect.value = settings.fontSize;
    if(colorSelect) colorSelect.value = settings.color;
    if(motionToggle) motionToggle.checked = settings.motion==="on";
    if(soundToggle) soundToggle.checked = settings.sound==="on";

    // Event listeners
    darkToggle?.addEventListener("change", () => { 
        settings.theme = darkToggle.checked?"dark":"light"; 
        applyAndSave();
    });
    fontSizeSelect?.addEventListener("change", () => { 
        settings.fontSize = fontSizeSelect.value; 
        applyAndSave();
    });
    colorSelect?.addEventListener("change", () => { 
        settings.color = colorSelect.value; 
        applyAndSave();
    });
    motionToggle?.addEventListener("change", () => { 
        settings.motion = motionToggle.checked?"on":"off"; 
        applyAndSave();
    });
    soundToggle?.addEventListener("change", () => { 
        settings.sound = soundToggle.checked?"on":"off"; 
        applyAndSave();
    });

    function applyAndSave(){
        applySettings(settings);
        saveSettings(settings);
    }
});

/* ===========================
   Apply Settings Helper
=========================== */
function applySettings(settings){
    // Theme
    document.body.style.background = settings.theme==="dark"?"#0f172a":"white";
    document.body.style.color = settings.theme==="dark"?"white":"black";

    // Font size
    document.body.style.fontSize = settings.fontSize + "px";

    // Accent color
    document.documentElement.style.setProperty(
        "--accent", settings.color==="green"?"#22c55e":"#38bdf8"
    );

    // Motion
    document.body.classList.toggle("reduce-motion", settings.motion==="off");

    // Sound
    window.soundEnabled = settings.sound==="on";
}
