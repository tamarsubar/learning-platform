const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { name, phone } = req.body; 
        const newUser = await User.create({ name, phone });
        res.status(201).json({ message: "משתמש נרשם בהצלחה!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "שגיאה ברישום המשתמש" });
    }
};