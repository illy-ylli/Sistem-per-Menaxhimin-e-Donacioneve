const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Ky model perfaqeson tabellen "donations" ne databaze
const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'campaigns',
            key: 'id'
        },
        comment: 'Fushata per te cilen eshte bere donacioni'
    },
    donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'donors',
            key: 'id'
        },
        comment: 'Donatori qe ka bere donacionin'
    },
    shuma: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01,
            isPositive(value) {
                if (value <= 0) {
                    throw new Error('Shuma duhet te jete me e madhe se 0');
                }
            }
        },
        comment: 'Shuma e donacionit ne Euro'
    },
    data: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Data kur eshte bere donacioni'
    },
    metoda_pageses: {
        type: DataTypes.ENUM('karte_krediti', 'paypal', 'bank_transfer', 'cash', 'other'),
        defaultValue: 'other',
        comment: 'Metoda e pageses se donacionit'
    },
    mesazhi: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Mesazhi opsional qe donatori le per fushaten'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true,
        comment: 'ID e transaksionit nga gateway-i i pagesave'
    },
    statusi: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        comment: 'Statusi i donacionit'
    },
    is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Neqoftese donatori deshiron te mbetet anonim'
    }
}, {
    tableName: 'donations',
    timestamps: true,
    indexes: [
        { fields: ['campaign_id'] },
        { fields: ['donor_id'] },
        { fields: ['data'] }
    ]
});



module.exports = Donation;