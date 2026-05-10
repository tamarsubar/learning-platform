const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            include: SubCategory
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "שגיאה בשליפת הקטגוריות" });
    }
};