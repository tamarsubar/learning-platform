const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category'); 

const SubCategory = sequelize.define('SubCategory', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    category_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, { 
    tableName: 'sub_categories', 
    timestamps: false 
});

Category.hasMany(SubCategory, { foreignKey: 'category_id' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = SubCategory;