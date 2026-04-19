const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Expense = sequelize.define('Expense', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    campaign_id: { type: DataTypes.INTEGER, allowNull: false },
    pershkrimi: { type: DataTypes.TEXT, allowNull: false },
    shuma: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    data: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'expenses', timestamps: true });

module.exports = Expense;