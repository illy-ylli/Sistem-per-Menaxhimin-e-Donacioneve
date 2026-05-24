const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// MODEL I PËRKOHSHËM - DO TË ZËVENDËSOHET ME VERSIONIN E PLOTË MË VONË
const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulli: {
        type: DataTypes.STRING(200),
        allowNull: false,
        defaultValue: 'Temp Campaign'
    },
    shuma_target: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    shuma_mbledhur: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    }
}, {
    tableName: 'campaigns',
    timestamps: true
});

module.exports = Campaign;