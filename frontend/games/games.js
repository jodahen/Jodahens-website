// games/games.js
// Populate games grid on games/index.html

// Make sure to import or include games-data.js before this script

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".game-grid");
    if (!grid) return;

    games.forEach(game => {
        const card = document.createElement("a");
        card.className = "game-card";
        card.href = game.file;
        card.textContent = `${game.title} – ${game.difficulty}`;
        grid.appendChild(card);
    });
});
