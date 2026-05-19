const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulli: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pershkrimi: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    shuma_target: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    shuma_mbledhur: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0.00
    },
    data_fillimit: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_perfundimit: {
        type: DataTypes.DATE,
        allowNull: false
    },
    statusi: {
        type: DataTypes.ENUM('aktive', 'ne_progres', 'perfunduar', 'anuluar'),
        defaultValue: 'ne_progres'
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'campaigns',
    timestamps: true
});

module.exports = Campaign;