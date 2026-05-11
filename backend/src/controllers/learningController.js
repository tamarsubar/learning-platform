const Prompt = require('../models/Prompt');
const aiService = require('../services/aiService');

exports.askQuestion = async (req, res) => {
    try {
        const { subCategoryId, categoryId, message, userId, session_id } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: "Message cannot be empty" });
        }
        if (message.trim().length < 2) {
            return res.status(400).json({ error: "Message must be at least 2 characters" });
        }
        if (!subCategoryId || !categoryId || !userId) {
            return res.status(400).json({ error: "Missing required details" });
        }

        const SubCategory = require('../models/SubCategory');
        const Category = require('../models/Category');
        const sub = await SubCategory.findByPk(subCategoryId);
        const cat = await Category.findByPk(categoryId);
        const contextualPrompt = `אתה מורה מומחה בנושא "${cat?.name || ''}" - "${sub?.name || ''}". ענה על השאלה הבאה בצורה חינוכית וברורה:\n${message.trim()}`;
        const aiResponse = await aiService.generateResponse(contextualPrompt);

        await Prompt.create({
            user_id: userId,
            category_id: categoryId,
            sub_category_id: subCategoryId,
            prompt: message.trim(),
            response: aiResponse,
            session_id: session_id || null,
        });

        res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Something went wrong with AI" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
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

exports.getSessionMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const messages = await Prompt.findAll({
            where: { session_id: sessionId },
            order: [['created_at', 'ASC']]
        });
        res.json(messages);
    } catch (e) {
        res.status(500).send(e);
    }
};
