const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donor = sequelize.define('Donor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    emri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mbiemri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    telefoni: {
        type: DataTypes.STRING,
        allowNull: true
    },
    adresa: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'donors',
    timestamps: true
});

module.exports = Donor;