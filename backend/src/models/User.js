const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'users', timestamps: false });

const Prompt = require('./Prompt');
User.hasMany(Prompt, { foreignKey: 'user_id', as: 'Prompts' });

module.exports = User;