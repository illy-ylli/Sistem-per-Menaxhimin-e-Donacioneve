const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    emri: { type: DataTypes.STRING, allowNull: false, unique: true },
    pershkrimi: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'categories', timestamps: true });

module.exports = Category;