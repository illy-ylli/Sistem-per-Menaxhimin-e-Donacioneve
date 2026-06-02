const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulli: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    pershkrimi: {
        type: DataTypes.TEXT,
        allowNull: true          
    },
    shuma_target: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    shuma_mbledhur: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    data_fillimit: {
        type: DataTypes.DATEONLY,
        allowNull: true          
    },
    data_perfundimit: {
        type: DataTypes.DATEONLY,
        allowNull: true          
    },
    statusi: {
        type: DataTypes.ENUM('aktive', 'ne_progres', 'perfunduar', 'anuluar'),
        defaultValue: 'ne_progres',
        allowNull: true          
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
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