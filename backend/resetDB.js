require('dotenv').config();
const sequelize = require('./src/db');
require('./src/models/Category');
require('./src/models/SubCategory');
require('./src/models/User');
require('./src/models/Prompt');

const reset = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database...');
    await sequelize.query('TRUNCATE TABLE prompts, sub_categories, categories RESTART IDENTITY CASCADE');
    console.log('✅ Database cleared! Now restart the server to seed new data.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sequelize.close();
  }
};

reset();
