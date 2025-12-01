// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file
const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"), (err) => {
    if (err) console.error("Database connection error:", err);
    else console.log("Connected to SQLite database.");
});

// Create users table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    settings TEXT
)
`);

module.exports = db;
