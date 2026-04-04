const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    userAgent: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true
});

module.exports = RefreshToken;