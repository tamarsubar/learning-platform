const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Validation
        if (!name || !phone) {
            return res.status(400).json({ error: "שם וטלפון הם שדות חובה" });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({ error: "שם חייב להכיל לפחות 2 תווים" });
        }
        if (phone.trim().length < 7) {
            return res.status(400).json({ error: "מספר טלפון לא תקין" });
        }

        const newUser = await User.create({ 
            name: name.trim(), 
            phone: phone.trim() 
        });
        res.status(201).json({ message: "משתמש נרשם בהצלחה!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: "שגיאה ברישום המשתמש" });
    }
};