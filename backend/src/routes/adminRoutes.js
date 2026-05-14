const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Prompt = require('../models/Prompt');

router.get('/login', (req, res) => {
    const { password } = req.query;
    if (password === process.env.ADMIN_PASSWORD) {
        res.json({ ok: true });
    } else {
        res.status(401).json({ ok: false });
    }
});

router.get('/users', async (req, res) => {
    if (req.query.password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const users = await User.findAll({
            include: [{
                model: Prompt,
                as: 'Prompts'
            }]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשליפת המשתמשים" });
    }
});

module.exports = router;