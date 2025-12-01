// backend/routes/settings.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// Get current user settings
router.get("/", (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    db.get("SELECT settings FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(JSON.parse(row.settings));
    });
});

// Update current user settings
router.post("/", (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    const newSettings = req.body;

    db.get("SELECT settings FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        const updatedSettings = { ...JSON.parse(row.settings), ...newSettings };
        db.run("UPDATE users SET settings = ? WHERE id = ?", [JSON.stringify(updatedSettings), userId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Settings updated" });
        });
    });
});

module.exports = router;
