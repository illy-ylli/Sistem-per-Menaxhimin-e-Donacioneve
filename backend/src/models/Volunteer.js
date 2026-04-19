const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Volunteer = sequelize.define('Volunteer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    emri: { type: DataTypes.STRING, allowNull: false },
    mbiemri: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    telefoni: { type: DataTypes.STRING, allowNull: true },
    statusi: { type: DataTypes.ENUM('aktiv', 'joaktiv'), defaultValue: 'aktiv' }
}, { tableName: 'volunteers', timestamps: true });

module.exports = Volunteer;