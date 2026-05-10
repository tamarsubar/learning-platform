const Prompt = require('../models/Prompt');

exports.askQuestion = async (req, res) => {
    try {
        const { user_id, category_id, sub_category_id, prompt } = req.body;

        const aiResponse = `שלום! שאלת לגבי "${prompt}". כרגע אני במצב בדיקה, אבל בעתיד כאן תופיע תשובה חכמה מה-AI!`;

        const newEntry = await Prompt.create({
            user_id,
            category_id,
            sub_category_id,
            prompt,
            response: aiResponse
        });

        res.status(200).json(newEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "משהו השתבש בתהליך הלמידה" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Prompt.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשליפת ההיסטוריה" });
    }
};