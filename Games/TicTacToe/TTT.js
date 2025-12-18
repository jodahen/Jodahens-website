// ================== ELEMENTS ==================
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

const setupModal = document.getElementById("setupModal");
const gameModeSelect = document.getElementById("gameMode");
const player1Input = document.getElementById("player1Name");
const player2Input = document.getElementById("player2Name");
const player2Wrapper = document.getElementById("player2Wrapper");
const aiDifficultySelect = document.getElementById("aiDifficulty");
const aiDifficultyWrapper = document.getElementById("aiDifficultyWrapper");
const startGameBtn = document.getElementById("startGameBtn");
const gameContainer = document.getElementById("gameContainer");

const confettiPopup = document.getElementById("confettiPopup");
const winnerMessage = document.getElementById("winnerMessage");
const closePopupBtn = document.getElementById("closePopup");

const roundCountSelect = document.getElementById("roundCount");

const scorePlayerXEl = document.getElementById("scorePlayerX");
const scorePlayerOEl = document.getElementById("scorePlayerO");

// ================== GAME STATE ==================
let currentPlayer = "X";
let startingPlayer = "X";
let gameActive = true;
let gameMode = "pvp";

let roundsToPlay = 1;
let currentRound = 1;

let playerNames = {
    X: "Player X",
    O: "Player O"
};

let scores = { X: 0, O: 0 };

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// ================== EVENT LISTENERS ==================
cells.forEach(cell => cell.addEventListener("click", () => handleClick(cell)));

resetBtn.addEventListener("click", resetGame);

gameModeSelect.addEventListener("change", () => {
    gameMode = gameModeSelect.value;
    player2Wrapper.style.display = gameMode === "cpu" ? "none" : "flex";
    aiDifficultyWrapper.style.display = gameMode === "cpu" ? "flex" : "none";
});

startGameBtn.addEventListener("click", startGame);

closePopupBtn.addEventListener("click", () => {
    confettiPopup.classList.remove("active");
    currentRound++;

    if (currentRound > roundsToPlay) {
        resetGame();
        setupModal.classList.add("active");
        gameContainer.classList.add("hidden");
    } else {
        nextRound();
    }
});

// ================== START GAME ==================
function startGame() {
    playerNames.X = player1Input.value.trim() || "Player X";
    playerNames.O = gameMode === "pvp"
        ? (player2Input.value.trim() || "Player O")
        : "Computer";

    roundsToPlay = parseInt(roundCountSelect.value, 10) || 1;
    currentRound = 1;
    scores = { X: 0, O: 0 };

    scorePlayerXEl.textContent = "0";
    scorePlayerOEl.textContent = "0";

    startingPlayer = gameMode === "cpu"
        ? (Math.random() < 0.5 ? "X" : "O")
        : "X";

    currentPlayer = startingPlayer;

    setupModal.classList.remove("active");
    gameContainer.classList.remove("hidden");

    updateStatus();

    if (gameMode === "cpu" && currentPlayer === "O") {
        aiTurn();
    }
}

// ================== GAME LOGIC ==================
function handleClick(cell) {
    if (!gameActive || cell.textContent) return;

    makeMove(cell);

    if (checkWin()) return endGame("win");
    if (isDraw()) return endGame("draw");

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();

    if (gameMode === "cpu" && currentPlayer === "O") {
        aiTurn();
    }
}

function makeMove(cell) {
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === "X" ? "red" : "cyan";
}

// ================== STATUS ==================
function updateStatus() {
    if (gameMode === "cpu" && currentPlayer === "O") {
        statusText.textContent = "AI is choosing...";
    } else {
        statusText.textContent = `${playerNames[currentPlayer]}'s turn`;
    }
}

// ================== END GAME ==================
function endGame(result) {
    gameActive = false;
    disableBoard();

    let message = "";

    if (result === "win") {
        scores[currentPlayer]++;
        updateScoreUI();

        message = gameMode === "cpu" && currentPlayer === "X"
            ? "You won!"
            : `${playerNames[currentPlayer]} won!`;
    }

    if (result === "lose") {
        scores.O++;
        updateScoreUI();
        message = "You lost!";
    }

    if (result === "draw") {
        message = "It's a tie!";
    }

    winnerMessage.textContent = message;
    confettiPopup.classList.add("active");
    launchConfetti();
}

// ================== NEXT ROUND ==================
function nextRound() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.style.color = "";
    });

    gameActive = true;

    startingPlayer = startingPlayer === "X" ? "O" : "X";
    currentPlayer = startingPlayer;

    updateStatus();

    if (gameMode === "cpu" && currentPlayer === "O") {
        aiTurn();
    }
}

// ================== RESET ==================
function resetGame() {
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = `${playerNames.X}'s turn`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.disabled = false;
        cell.style.color = "";
    });

    scores = { X: 0, O: 0 };
    updateScoreUI();
}

// ================== CHECKS ==================
function checkWin() {
    return winPatterns.some(p =>
        p.every(i => cells[i].textContent === currentPlayer)
    );
}

function isDraw() {
    return [...cells].every(c => c.textContent);
}

// ================== BOARD CONTROL ==================
function disableBoard() {
    cells.forEach(c => c.disabled = true);
}

function enableBoard() {
    cells.forEach(c => {
        if (!c.textContent) c.disabled = false;
    });
}

// ================== CONFETTI ==================
function launchConfetti() {
    confettiPopup.querySelectorAll(".confetti").forEach(c => c.remove());

    for (let i = 0; i < 300; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.backgroundColor = randomColor();
        confetti.style.animationDuration = (1.5 + Math.random()) + "s";
        confettiPopup.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function randomColor() {
    const colors = ["#f87171", "#34d399", "#60a5fa", "#facc15", "#a78bfa"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ================== AI ==================
function aiTurn() {
    disableBoard();

    setTimeout(() => {
        aiMove();

        if (checkWin()) return endGame("lose");
        if (isDraw()) return endGame("draw");

        currentPlayer = "X";
        updateStatus();
        enableBoard();
    }, 800);
}

function aiMove() {
    const emptyCells = [...cells].filter(c => !c.textContent);
    if (!emptyCells.length) return;

    const difficulty = aiDifficultySelect.value;
    let choice;

    if (difficulty === "easy") {
        choice = randomMove(emptyCells);
    } else if (difficulty === "medium") {
        choice = mediumAI() || randomMove(emptyCells);
    } else if (difficulty === "hard") {
        choice = hardAI() || mediumAI() || randomMove(emptyCells);
    } else {
        choice = impossibleAI();
    }

    makeMove(choice);
}

function randomMove(cells) {
    return cells[Math.floor(Math.random() * cells.length)];
}

function mediumAI() {
    return findLine("O") || findLine("X");
}

function hardAI() {
    if (!cells[4].textContent) return cells[4];
    const corners = [0,2,6,8].filter(i => !cells[i].textContent);
    return corners.length ? cells[corners[Math.floor(Math.random() * corners.length)]] : null;
}

function findLine(player) {
    for (const pattern of winPatterns) {
        const values = pattern.map(i => cells[i].textContent);
        if (values.filter(v => v === player).length === 2 && values.includes("")) {
            return cells[pattern[values.indexOf("")]];
        }
    }
    return null;
}

// ================== IMPOSSIBLE (MINIMAX) ==================
function impossibleAI() {
    let bestScore = -Infinity;
    let move;

    cells.forEach(cell => {
        if (!cell.textContent) {
            cell.textContent = "O";
            const score = minimax(false);
            cell.textContent = "";

            if (score > bestScore) {
                bestScore = score;
                move = cell;
            }
        }
    });

    return move;
}

function minimax(isMax) {
    if (checkWinner("O")) return 1;
    if (checkWinner("X")) return -1;
    if (isDraw()) return 0;

    let best = isMax ? -Infinity : Infinity;

    cells.forEach(cell => {
        if (!cell.textContent) {
            cell.textContent = isMax ? "O" : "X";
            const score = minimax(!isMax);
            cell.textContent = "";

            best = isMax ? Math.max(best, score) : Math.min(best, score);
        }
    });

    return best;
}

function checkWinner(player) {
    return winPatterns.some(p => p.every(i => cells[i].textContent === player));
}

// ================== SCORE ==================
function updateScoreUI() {
    scorePlayerXEl.textContent = scores["X"];
    scorePlayerOEl.textContent = scores["O"];
}
