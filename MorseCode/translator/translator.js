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
    "0": "-----", "1": ".----",
    "2": "..---", "3": "...--",
    "4": "....-", "5": ".....",
    "6": "-....", "7": "--...",
    "8": "---..", "9": "----.",

    // Punctuation
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    "_": "..--.-",
    "\"": ".-..-.",
    "$": "...-..-",
    "@": ".--.-.",

    // Additional symbols
    "¿": "..-.-",
    "¡": "--...-"
};

// Create reverse mapping for Morse → text
const reverseMorseMap = {};
for (let key in morseMap) {
    reverseMorseMap[morseMap[key]] = key;
}

const input = document.getElementById("morseInput");
const output = document.getElementById("textOutput");
const button = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const charCount = document.getElementById("charCount");
const maxChars = 500;

// Auto-resize textarea
function autoResize(element) {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
}

// Convert Morse to Text
function convertToText(morse) {
    const words = morse.trim().split(" / ");
    let result = "";

    words.forEach((word, wi) => {
        const letters = word.trim().split(" ");
        letters.forEach(letter => {
            if (reverseMorseMap[letter]) {
                result += reverseMorseMap[letter];
            }
        });
        if (wi < words.length - 1) result += " ";
    });

    return result.toLowerCase();
}

// Update output
function updateOutput(text) {
    output.textContent = text;

    // Show copy button only if there is text
    if (text.trim().length > 0) {
        copyBtn.style.display = "block";
    } else {
        copyBtn.style.display = "none";
    }
}

copyBtn.style.display = "none";

// Event listeners
input.addEventListener("input", () => {
    if (input.value.length > maxChars) input.value = input.value.slice(0, maxChars);
    charCount.textContent = `${input.value.length} / ${maxChars}`;
    autoResize(input);
    updateOutput(convertToText(input.value));

    const text = convertToMorse(input.value);
    updateOutput(text);
});

button.addEventListener("click", () => updateOutput(convertToText(input.value)));

copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text)
        .then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => copyBtn.textContent = "Copy", 1500);
        })
        .catch(err => console.error("Failed to copy:", err));
});
