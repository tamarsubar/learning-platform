require('dotenv').config();
const cors = require('cors');
const express = require('express');
const sequelize = require('./src/db');
const Category = require('./src/models/Category');
const SubCategory = require('./src/models/SubCategory');
require('./src/models/User');
require('./src/models/Prompt');

const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/learning', require('./src/routes/learningRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

const seedDatabase = async () => {
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
        console.log('🌱 Filling database with initial categories...');
        
        const history = await Category.create({ name: 'היסטוריה' });
        await SubCategory.bulkCreate([
            { name: 'יוון העתיקה', category_id: history.id },
            { name: 'המהמהפכה הצרפתית', category_id: history.id },
            { name: 'תולדות מדינת ישראל', category_id: history.id }
        ]);

        const science = await Category.create({ name: 'מדע' });
        await SubCategory.bulkCreate([
            { name: 'אסטרונומיה וחלל', category_id: science.id },
            { name: 'ביולוגיה של האדם', category_id: science.id }
        ]);

        const tech = await Category.create({ name: 'טכנולוגיה' });
        await SubCategory.bulkCreate([
            { name: 'בינה מלאכותית', category_id: tech.id },
            { name: 'פיתוח אפליקציות', category_id: tech.id }
        ]);

        console.log('✅ Database seeded successfully!');
    }
};

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to PostgreSQL has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('✅ All models were synchronized successfully.');

        await seedDatabase();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

startServer();