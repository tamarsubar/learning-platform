const Prompt = require('../models/Prompt');
const aiService = require('../services/aiService');

exports.askQuestion = async (req, res) => {
    try {
        const { subCategoryId, categoryId, message, userId } = req.body;

        // Validation
        if (!message || !message.trim()) {
            return res.status(400).json({ error: "הודעה לא יכולה להיות ריקה" });
        }
        if (message.trim().length < 2) {
            return res.status(400).json({ error: "הודעה חייבת להכיל לפחות 2 תווים" });
        }
        if (!subCategoryId || !categoryId || !userId) {
            return res.status(400).json({ error: "חסרים פרטים נדרשים" });
        }

        const aiResponse = await aiService.generateResponse(message.trim());

        await Prompt.create({
            user_id: userId,
            category_id: categoryId,
            sub_category_id: subCategoryId,
            prompt: message.trim(),
            response: aiResponse
        });

        res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "משהו השתבש בחיבור ל-AI" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "מזהה משתמש לא תקין" });
        }

        const history = await Prompt.findAll({ 
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        res.json(history);
    } catch (e) { 
        res.status(500).send(e); 
    }
};