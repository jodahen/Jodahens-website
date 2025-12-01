// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const { createUser, getUserByEmail } = require("../models/user");
const bcrypt = require("bcrypt");

// Signup route
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

    try {
        const user = await createUser(username, email, password);
        req.session.userId = user.id;
        res.json({ message: "User created", user: { username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid email or password" });

        req.session.userId = user.id;
        res.json({ message: "Logged in", user: { username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout route
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
