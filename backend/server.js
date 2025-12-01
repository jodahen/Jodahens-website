// backend/server.js
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

// ===== Middleware =====
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:5500", // frontend URL
    credentials: true
}));

app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true
}));

// ===== Routes =====
app.use("/api/auth", authRoutes);

// User settings routes
const db = require("./db");

app.get("/api/user/settings", (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Not logged in" });

    db.get("SELECT settings FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(JSON.parse(row.settings));
    });
});

app.post("/api/user/settings", (req, res) => {
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

// ===== Start server =====
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
