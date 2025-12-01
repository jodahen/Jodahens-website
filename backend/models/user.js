// backend/models/user.js
const db = require("../db");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Create a new user
const createUser = (username, email, password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
            if (err) return reject(err);

            const stmt = db.prepare("INSERT INTO users (username, email, password, settings) VALUES (?, ?, ?, ?)");
            stmt.run(
                username,
                email,
                hash,
                JSON.stringify({ theme: "dark", fontSize: "16", color: "blue", motion: "on", sound: "on" }),
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, username, email });
                }
            );
        });
    });
};

// Get user by email
const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Get user by ID
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

module.exports = { createUser, getUserByEmail, getUserById };
