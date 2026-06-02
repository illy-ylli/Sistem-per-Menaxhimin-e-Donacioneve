const { sequelize } = require('../config/database');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Expense = require('../models/Expense');
const Donor = require('../models/Donor');

// 1. Donations per campaign
const getDonationsPerCampaign = async (req, res) => {
    try {
        const results = await Donation.findAll({
            attributes: [
                'campaign_id',
                [sequelize.fn('SUM', sequelize.col('shuma')), 'total_donated'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'donation_count']
            ],
            include: [{ model: Campaign, as: 'campaign', attributes: ['titulli', 'shuma_target'] }],
            group: ['campaign_id', 'campaign.id']
        });
        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Top donors
const getTopDonors = async (req, res) => {
    try {
        const topDonors = await Donation.findAll({
            attributes: [
                'donor_id',
                [sequelize.fn('SUM', sequelize.col('shuma')), 'total_donated']
            ],
            include: [{ model: Donor, as: 'donor', attributes: ['emri', 'mbiemri', 'email'] }],
            group: ['donor_id', 'donor.id'],
            order: [[sequelize.fn('SUM', sequelize.col('shuma')), 'DESC']],
            limit: 10
        });
        res.json({ success: true, data: topDonors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Expenses per campaign
const getExpensesPerCampaign = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            attributes: [
                'campaign_id',
                [sequelize.fn('SUM', sequelize.col('shuma')), 'total_expenses']
            ],
            include: [{ model: Campaign, as: 'expense_campaign', attributes: ['titulli'] }],
            group: ['campaign_id', 'expense_campaign.id']
        });
        res.json({ success: true, data: expenses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Campaign summary (PER TARGET, COLLECTED, EXPENSES, DHE NET)
const getCampaignSummary = async (req, res) => {
    try {
        const campaigns = await Campaign.findAll({
            attributes: ['id', 'titulli', 'shuma_target', 'shuma_mbledhur'],
            include: [
                { model: Expense, as: 'expenses', attributes: [[sequelize.fn('SUM', sequelize.col('shuma')), 'total_expenses']] },
            ],
            group: ['id']
        });
        // Manually compute net
        const summary = campaigns.map(c => ({
            id: c.id,
            titulli: c.titulli,
            shuma_target: c.shuma_target,
            shuma_mbledhur: c.shuma_mbledhur,
            total_expenses: c.expenses.reduce((sum, e) => sum + (e.shuma || 0), 0),
            net_funds: c.shuma_mbledhur - c.expenses.reduce((sum, e) => sum + (e.shuma || 0), 0)
        }));
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDonationsPerCampaign,
    getTopDonors,
    getExpensesPerCampaign,
    getCampaignSummary
};