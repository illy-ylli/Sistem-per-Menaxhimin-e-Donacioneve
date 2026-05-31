const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Donor = require('../models/Donor');
const Expense = require('../models/Expense');

const getDashboardStats = async (req, res) => {
    try {
        const totalCollected = await Donation.sum('shuma', { where: { statusi: 'completed' } }) || 0;
        const donationCount = await Donation.count({ where: { statusi: 'completed' } });
        const activeCampaigns = await Campaign.count();
        const donorCount = await Donor.count();
        const totalExpenses = await Expense.sum('shuma') || 0;
        
        const recentDonations = await Donation.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10
        });
        
        res.json({
            success: true,
            data: {
                totalDonations: totalCollected,
                donationCount: donationCount,
                totalCollected: totalCollected,
                activeCampaigns: activeCampaigns,
                donorCount: donorCount,
                totalExpenses: totalExpenses,
                netAmount: totalCollected - totalExpenses,
                recentDonations: recentDonations
            }
        });
    } catch (error) {
        console.error('Gabim:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getDashboardStats };