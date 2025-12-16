const morseMap = {
    // Letters
    "a": ".-",    "b": "-...",  "c": "-.-.",
    "d": "-..",   "e": ".",     "f": "..-.",
    "g": "--.",   "h": "....",
    "i": "..",    "j": ".---",
    "k": "-.-",   "l": ".-..",
    "m": "--",    "n": "-.",
    "o": "---",   "p": ".--.",
    "q": "--.-",  "r": ".-.",
    "s": "...",   "t": "-",
    "u": "..-",   "v": "...-",
    "w": ".--",   "x": "-..-",
    "y": "-.--",  "z": "--..",
    // Digits
    "0": "-----", "1": ".----","2": "..---","3": "...--",
    "4": "....-", "5": ".....","6": "-....","7": "--...",
    "8": "---..", "9": "----.",
    // Punctuation
    ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.",
    "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
    "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-",
    "+": ".-.-.", "-": "-....-", "_": "..--.-", "\"": ".-..-.",
    "$": "...-..-", "@": ".--.-.", "¿": "..-.-", "¡": "--...-"
};

const input = document.getElementById("textInput");
const output = document.getElementById("morseOutput");
const button = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const charCount = document.getElementById("charCount");
const maxChars = 250;

// Initialize copy button hidden
copyBtn.style.display = "none";

// Auto-resize textarea
function autoResize(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
}

// Convert text to Morse
function convertToMorse(text) {
    let result = "";
    for (let char of text.toLowerCase()) {
        if (char === " ") {
            result += " / ";
        } else if (morseMap[char]) {
            result += morseMap[char] + " ";
        }
    }
    return result.trim();
}

// Update output and copy button visibility
function updateOutput(text) {
    output.textContent = text;

    if (text.trim().length > 0) {
        copyBtn.style.display = "block";
    } else {
        copyBtn.style.display = "none";
    }
}

// Event listeners
input.addEventListener("input", () => {
    if (input.value.length > maxChars) input.value = input.value.slice(0, maxChars);
    charCount.textContent = `${input.value.length} / ${maxChars}`;
    autoResize(input);
    updateOutput(convertToMorse(input.value));
});

button.addEventListener("click", () => {
    updateOutput(convertToMorse(input.value));
});

copyBtn.addEventListener("click", () => {
    const morseText = output.textContent;
    if (!morseText) return;

    navigator.clipboard.writeText(morseText)
        .then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
                copyBtn.textContent = "Copy";
            }, 1500);
        })
        .catch(err => console.error("Failed to copy:", err));
});
