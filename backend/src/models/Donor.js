const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// MODEL I PËRKOHSHËM - DO TË ZËVENDËSOHET ME VERSIONIN E PLOTË MË VONË
const Donor = sequelize.define('Donor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    emri: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Temp'
    },
    mbiemri: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Donor'
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'temp@donor.com'
    },
    telefoni: { type: DataTypes.STRING,
         allowNull: true 
        },
    adresa: { type: DataTypes.STRING, 
        allowNull: true 
    }
}, {
    tableName: 'donors',
    timestamps: true
});

module.exports = Donor;