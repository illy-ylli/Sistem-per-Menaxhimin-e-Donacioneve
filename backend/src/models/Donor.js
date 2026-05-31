const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donor = sequelize.define('Donor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    emri: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    mbiemri: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    // Këto kolona mund të mos ekzistojnë në DB - komentoji ose shtoji në DB
    // telefoni: { type: DataTypes.STRING, allowNull: true },
    // adresa: { type: DataTypes.STRING, allowNull: true },
    // total_dhuruar: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    // donation_count: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'donors',
    timestamps: true
});

module.exports = Donor;