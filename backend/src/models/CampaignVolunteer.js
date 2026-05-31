const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CampaignVolunteer = sequelize.define('CampaignVolunteer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    campaign_id: { type: DataTypes.INTEGER, allowNull: false },
    volunteer_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: 'campaign_volunteers',
    timestamps: true
});

module.exports = CampaignVolunteer;