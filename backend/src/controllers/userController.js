const e = require('express');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Validation
        if (!name || !phone) {
            return res.status(400).json({ error: "Name and phone are required" });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: "Name must be at least 2 characters" });
        }
        if (phone.trim().length < 7) {
            return res.status(400).json({ error: "Invalid phone number" });
        }

        const existingUser = await User.findOne({ where: { phone: phone.trim() } });
        if (existingUser) {
            return res.status(200).json({ message: "Welcome back!", user: existingUser });
        }

        const newUser = await User.create({
            name: name.trim(),
            phone: phone.trim()
        });
        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message || "Registration error" });
    }
};