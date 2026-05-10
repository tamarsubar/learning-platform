const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Prompt = require('../models/Prompt');

router.get('/users', async (req, res) => {
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