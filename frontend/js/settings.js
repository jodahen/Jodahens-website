// settings.js
async function fetchSettings() {
    try {
        const res = await fetch("http://localhost:3000/api/user/settings", { credentials: "include" });
        if(res.ok) return await res.json();
    } catch(err) { console.error(err); }
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
    } catch(err) { console.error(err); }
}

function applySettings(settings){
    document.body.style.background = settings.theme==="dark"?"#0f172a":"white";
    document.body.style.color = settings.theme==="dark"?"white":"black";
    document.body.style.fontSize = settings.fontSize + "px";
    document.documentElement.style.setProperty("--accent", settings.color==="green"?"#22c55e":"#38bdf8");
    document.body.classList.toggle("reduce-motion", settings.motion==="off");
    window.soundEnabled = settings.sound==="on";
}

document.addEventListener("DOMContentLoaded", async () => {
    const darkToggle = document.getElementById("darkToggle");
    const fontSizeSelect = document.getElementById("font-size");
    const colorSelect = document.getElementById("color-scheme");
    const motionToggle = document.getElementById("motion-toggle");
    const soundToggle = document.getElementById("sound-toggle");

    let settings = await fetchSettings() || { theme:"dark", fontSize:"16", color:"blue", motion:"on", sound:"on" };
    applySettings(settings);

    if(darkToggle) darkToggle.checked = settings.theme==="dark";
    if(fontSizeSelect) fontSizeSelect.value = settings.fontSize;
    if(colorSelect) colorSelect.value = settings.color;
    if(motionToggle) motionToggle.checked = settings.motion==="on";
    if(soundToggle) soundToggle.checked = settings.sound==="on";

    darkToggle?.addEventListener("change", () => { settings.theme = darkToggle.checked?"dark":"light"; applyAndSave(); });
    fontSizeSelect?.addEventListener("change", () => { settings.fontSize = fontSizeSelect.value; applyAndSave(); });
    colorSelect?.addEventListener("change", () => { settings.color = colorSelect.value; applyAndSave(); });
    motionToggle?.addEventListener("change", () => { settings.motion = motionToggle.checked?"on":"off"; applyAndSave(); });
    soundToggle?.addEventListener("change", () => { settings.sound = soundToggle.checked?"on":"off"; applyAndSave(); });

    function applyAndSave(){
        applySettings(settings);
        saveSettings(settings);
    }
});
