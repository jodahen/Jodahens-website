// -----------------------------
// DOM References
// -----------------------------
const messageBox = document.getElementById("messageBox");
const showSettingsBtn = document.getElementById('showSettingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const closeSettings = document.getElementById('closeSettings');
const grid = document.getElementById('grid');
const button = document.getElementById('submitBtn');
const useRandomWordsCheckbox = document.getElementById('useRandomWords');

// -----------------------------
// Word List & Settings
// -----------------------------
let wordLength = 5;
let words5 = [], words6 = [];
let randomWords5 = [], randomWords6 = [];
let secretWord;
let currentRow = 0, currentTile = 0;
const maxRows = 6;
let isRevealing = false;

// -----------------------------
// Load Words
// -----------------------------
function loadWords() {
    return Promise.all([
        fetch('../assets/words/words5.txt').then(r => r.text()).then(t => words5 = t.split('\n').map(w => w.trim())),
        fetch('../assets/words/words6.txt').then(r => r.text()).then(t => words6 = t.split('\n').map(w => w.trim()))
    ]);
}

function loadRandomWords() {
    return Promise.all([
        fetch('../assets/words/randomWords5.txt').then(r => r.text()).then(t => randomWords5 = t.split('\n').map(w => w.trim())),
        fetch('../assets/words/randomWords6.txt').then(r => r.text()).then(t => randomWords6 = t.split('\n').map(w => w.trim()))
    ]);
}

// Load words and initialize
Promise.all([loadWords(), loadRandomWords()]).then(() => {
    secretWord = getSecretWord(wordLength);
    buildGrid();
    refreshActiveRow(); // Show cursor on first tile
});

// -----------------------------
// Get Secret Word
// -----------------------------
function getSecretWord(length) {
    const list = (useRandomWordsCheckbox.checked)
        ? (length === 5 ? randomWords5 : randomWords6)
        : (length === 5 ? words5 : words6);
    return list[Math.floor(Math.random() * list.length)];
}

// -----------------------------
// Build Grid
// -----------------------------
function buildGrid() {
    grid.style.setProperty('--word-length', wordLength);
    grid.innerHTML = '';
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            row.appendChild(tile);
        }
        grid.appendChild(row);
    }
    currentRow = 0;
    currentTile = 0;
}

// -----------------------------
// Active Row Handling
// -----------------------------
function enableRowClick() {
    const row = grid.children[currentRow];
    if (!row) return;
    for (let i = 0; i < wordLength; i++) {
        const tile = row.children[i];
        tile.onclick = () => {
            if (!isRevealing) {
                currentTile = i;
                updateActiveTile();
            }
        };
    }
}

function refreshActiveRow() {
    updateActiveTile();
    enableRowClick();
}

function updateActiveTile() {
    const row = grid.children[currentRow];
    if (!row) return;
    for (let i = 0; i < wordLength; i++) {
        row.children[i].classList.remove('active');
    }
    if (currentTile < wordLength && !isRevealing) {
        const tile = row.children[currentTile];
        if (!tile.textContent) tile.classList.add('active');
    }
}

// -----------------------------
// Show Message
// -----------------------------
function showMessage(text, duration = 2000) {
  messageBox.textContent = text;
  messageBox.style.opacity = '1';
  messageBox.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    messageBox.style.opacity = '0';
    messageBox.style.transform = 'translateX(-50%) translateY(-20px)';
  }, duration);
}

// -----------------------------
// Reveal Tile Animation (improved)
// -----------------------------
function revealTile(tile, delay) {
  setTimeout(() => {
    tile.classList.remove('flip');  // reset
    void tile.offsetWidth;           // force reflow
    tile.classList.add('flip');      // apply animation
  }, delay);
}

// -----------------------------
// Submit Guess
// -----------------------------
function submitGuess() {
    if (isRevealing) return;

    const row = grid.children[currentRow];
    let guess = '';
    for (let i = 0; i < wordLength; i++) {
        guess += row.children[i].textContent.toLowerCase();
    }

    if (guess.length !== wordLength) {
        showMessage(`Enter a ${wordLength}-letter word`);
        return;
    }

    if (currentRow >= maxRows) return;

    isRevealing = true;
    const secretLetters = secretWord.split("");

    // First pass: exact matches
    for (let i = 0; i < wordLength; i++) {
        const tile = row.children[i];
        if (guess[i] === secretWord[i]) {
            tile.classList.add("correct");
            secretLetters[i] = null;
        }
    }

    // Second pass: present / absent
    for (let i = 0; i < wordLength; i++) {
        const tile = row.children[i];
        if (!tile.classList.contains("correct")) {
            const index = secretLetters.indexOf(guess[i]);
            if (index !== -1) {
                tile.classList.add("present");
                secretLetters[index] = null;
            } else {
                tile.classList.add("absent");
            }
        }
        revealTile(tile, i * 300); // sequential flip
    }

    setTimeout(() => {
        if (guess === secretWord) {
            showMessage(`You won in ${currentRow + 1} tries!`);
            button.disabled = true;
            setTimeout(resetGame, 2000);
        } else {
            currentRow++;
            currentTile = 0;
            if (currentRow === maxRows) {
                showMessage(`Game over! Word was "${secretWord.toUpperCase()}"`);
                button.disabled = true;
                setTimeout(resetGame, 2000);
            }
        }
        isRevealing = false;
        refreshActiveRow();
    }, wordLength * 300 + 350);
}

// -----------------------------
// Reset Game
// -----------------------------
function resetGame() {
    secretWord = getSecretWord(wordLength);
    currentRow = 0;
    currentTile = 0;
    button.disabled = false;
    buildGrid();
    refreshActiveRow();
}

// -----------------------------
// Keyboard input
// -----------------------------
document.addEventListener('keydown', (e) => {
    if (isRevealing) return;
    const row = grid.children[currentRow];
    if (!row) return;

    if (e.key === 'Backspace') {
        if (currentTile > 0) {
            currentTile--;
            const tile = row.children[currentTile];
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    } else if (e.key === 'Enter') {
        if (currentTile === wordLength) submitGuess();
        else showMessage(`Enter a ${wordLength}-letter word`);
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentTile < wordLength) {
            const tile = row.children[currentTile];
            tile.textContent = e.key.toUpperCase();
            tile.classList.add('filled');
            currentTile++;
        }
    }

    updateActiveTile();
});

// -----------------------------
// Button & Settings
// -----------------------------
button.addEventListener('click', () => {
    if (!isRevealing && currentTile === wordLength) submitGuess();
    else if (currentTile !== wordLength) showMessage(`Enter a ${wordLength}-letter word`);
});

showSettingsBtn.addEventListener('click', () => settingsPopup.style.display = 'flex');

closeSettings.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
    refreshActiveRow();
});

settingsPopup.addEventListener('click', (e) => {
    if (e.target === settingsPopup) {
        settingsPopup.style.display = 'none';
        refreshActiveRow();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        settingsPopup.style.display = 'none';
        refreshActiveRow();
    }
});

// Word length and random words
const wordLengthSelect = document.getElementById('wordLengthSelect');
if (wordLengthSelect) {
    wordLengthSelect.addEventListener('change', () => {
        wordLength = parseInt(wordLengthSelect.value);
        secretWord = getSecretWord(wordLength);
        currentRow = 0;
        currentTile = 0;
        button.disabled = false;
        buildGrid();
        refreshActiveRow();
        showMessage(`${wordLength}-letter mode activated`);
    });
}

useRandomWordsCheckbox.addEventListener('change', () => {
    resetGame();
    if (useRandomWordsCheckbox.checked) showMessage("Random words activated");
    else showMessage("Normal words activated");
});
