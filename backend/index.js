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

        const history = await Category.create({ name: 'History' });
        await SubCategory.bulkCreate([
            { name: 'Ancient Greece', category_id: history.id },
            { name: 'The French Revolution', category_id: history.id },
            { name: 'History of Israel', category_id: history.id },
            { name: 'World War II', category_id: history.id },
            { name: 'The Roman Empire', category_id: history.id },
            { name: 'The Industrial Revolution', category_id: history.id }
        ]);

        const science = await Category.create({ name: 'Science' });
        await SubCategory.bulkCreate([
            { name: 'Astronomy & Space', category_id: science.id },
            { name: 'Human Biology', category_id: science.id },
            { name: 'Quantum Physics', category_id: science.id },
            { name: 'Organic Chemistry', category_id: science.id },
            { name: 'Evolution & Genetics', category_id: science.id }
        ]);

        const tech = await Category.create({ name: 'Technology' });
        await SubCategory.bulkCreate([
            { name: 'Artificial Intelligence', category_id: tech.id },
            { name: 'App Development', category_id: tech.id },
            { name: 'Cybersecurity', category_id: tech.id },
            { name: 'Computer Networks', category_id: tech.id },
            { name: 'Databases', category_id: tech.id }
        ]);

        const math = await Category.create({ name: 'Mathematics' });
        await SubCategory.bulkCreate([
            { name: 'Linear Algebra', category_id: math.id },
            { name: 'Differential Calculus', category_id: math.id },
            { name: 'Analytic Geometry', category_id: math.id },
            { name: 'Set Theory', category_id: math.id },
            { name: 'Statistics & Probability', category_id: math.id }
        ]);

        const literature = await Category.create({ name: 'Literature & Language' });
        await SubCategory.bulkCreate([
            { name: 'Modern Hebrew Literature', category_id: literature.id },
            { name: 'Classic World Literature', category_id: literature.id },
            { name: 'Poetry & Poetics', category_id: literature.id },
            { name: 'Linguistics', category_id: literature.id }
        ]);

        const geo = await Category.create({ name: 'Geography' });
        await SubCategory.bulkCreate([
            { name: 'Geography of Israel', category_id: geo.id },
            { name: 'Continents & Oceans', category_id: geo.id },
            { name: 'Climate & Weather', category_id: geo.id },
            { name: 'Countries & Capitals', category_id: geo.id }
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