const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Ky model perfaqeson tabellen "donations" ne databaze
// Ruan cdo donacion qe behet nga nje donator per nje fushate
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
            model: 'campaigns',     // Lidhet me tabellen campaigns
            key: 'id'
        },
        comment: 'Fushata per te cilen eshte bere donacioni'
    },
    donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'donors',        // Lidhet me tabellen donors
            key: 'id'
        },
        comment: 'Donatori qe ka bere donacionin'
    },
    shuma: {
        type: DataTypes.DECIMAL(10, 2),  // Decimal me 10 shifra gjithsej, 2 pas presjes
        allowNull: false,
        validate: {
            min: 0.01,                   // Shuma minimale 0.01 euro
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
        defaultValue: DataTypes.NOW,    // Data aktuale neqoftese nuk jepet
        comment: 'Data kur eshte bere donacioni'
    },
    metoda_pageses: {
        type: DataTypes.ENUM('karte_krediti', 'paypal', 'bank_transfer', 'cash', 'other'),
        defaultValue: 'other',
        comment: 'Mennya e pageses se donacionit'
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
        comment: 'Statusi i donacionit (ne pritje, i perfunduar, deshtoi, rimbursuar)'
    },
    is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Neqoftese donatori deshiron te mbetet anonim'
    }
}, {
    tableName: 'donations',
    timestamps: true,
    
    // Indekset per performance me te mire ne kerkim
    indexes: [
        {
            fields: ['campaign_id']   // Indeks per te gjetur donacionet e nje fushate shpejt
        },
        {
            fields: ['donor_id']      // Indeks per te gjetur donacionet e nje donatori shpejt
        },
        {
            fields: ['data']          // Indeks per te filtruar sipas dates
        }
    ]
});

// Metode ndihmese per te marre emrin e donatorit (anonim ose jo)
// Kjo do te perdoret nga controller-i kur te dergojme pergjigjen
Donation.prototype.getDonorName = function(donor) {
    if (this.is_anonymous) {
        return 'Donator Anonim';
    }
    return donor ? `${donor.emri} ${donor.mbiemri}` : 'Donator i panjohur';
};

module.exports = Donation;