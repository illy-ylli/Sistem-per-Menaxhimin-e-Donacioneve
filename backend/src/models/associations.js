// ============================================
// TË GJITHA MARRËDHËNIET MIDIS MODELEVE
// ============================================

const User = require('./User');
const RefreshToken = require('./RefreshToken');
const CampaignCategory = require('./CampaignCategory');
const Campaign = require('./Campaign');
const Donor = require('./Donor');
const Donation = require('./Donation');
const Expense = require('./Expense');
const Volunteer = require('./Volunteer');

console.log('🟢 Vendosja e marrëdhënieve...');

// USER & REFRESH TOKEN
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// USER & DONOR
User.hasOne(Donor, { foreignKey: 'user_id', as: 'donor', onDelete: 'SET NULL' });
Donor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// CAMPAIGN & CAMPAIGN CATEGORY
CampaignCategory.hasMany(Campaign, { foreignKey: 'category_id', as: 'campaigns', onDelete: 'RESTRICT' });
Campaign.belongsTo(CampaignCategory, { foreignKey: 'category_id', as: 'category', onDelete: 'RESTRICT' });

// DONATION & CAMPAIGN
Donation.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'campaign', onDelete: 'CASCADE' });
Campaign.hasMany(Donation, { foreignKey: 'campaign_id', as: 'donations', onDelete: 'CASCADE' });

// DONATION & DONOR
Donation.belongsTo(Donor, { foreignKey: 'donor_id', as: 'donor', onDelete: 'RESTRICT' });
Donor.hasMany(Donation, { foreignKey: 'donor_id', as: 'donor_donations', onDelete: 'RESTRICT' });  // Alias unik

// EXPENSE & CAMPAIGN - ALIAS UNIK!
Expense.belongsTo(Campaign, { foreignKey: 'campaign_id', as: 'expense_campaign', onDelete: 'CASCADE' });
Campaign.hasMany(Expense, { foreignKey: 'campaign_id', as: 'expenses', onDelete: 'CASCADE' });

// VOLUNTEER & USER
User.hasOne(Volunteer, { foreignKey: 'user_id', as: 'volunteer', onDelete: 'SET NULL' });
Volunteer.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

console.log('✅ Të gjitha marrëdhëniet u vendosën me sukses!');