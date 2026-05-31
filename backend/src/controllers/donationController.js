const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Donor = require('../models/Donor');

// ============================================
// 1. MERRI TE GJITHA DONACIONET
// ============================================
const getAllDonations = async (req, res) => {
    try {
        let donations;
        
        // Nese perdoruesi eshte admin/manager, merr te gjitha donacionet
        if (req.user.role === 'admin' || req.user.role === 'manager') {
            donations = await Donation.findAll({
                include: [
                    { model: Donor, as: 'donor', attributes: ['emri', 'mbiemri'] },
                    { model: Campaign, as: 'campaign', attributes: ['titulli'] }
                ],
                order: [['createdAt', 'DESC']]
            });
        } else {
            // Perdorues normal - merr donacionet e tij/saj
            const donor = await Donor.findOne({ where: { email: req.user.email } });
            if (donor) {
                donations = await Donation.findAll({
                    where: { donor_id: donor.id },
                    include: [
                        { model: Campaign, as: 'campaign', attributes: ['titulli'] }
                    ],
                    order: [['createdAt', 'DESC']]
                });
            } else {
                donations = [];
            }
        }
        
        res.json({ 
            success: true, 
            count: donations.length, 
            data: donations 
        });
    } catch (error) {
        console.error('Gabim ne getAllDonations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim gjate marrjes se donacioneve: ' + error.message 
        });
    }
};

// ============================================
// 2. MERRI NJE DONACION SPECIFIK
// ============================================
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id, {
            include: [
                { model: Donor, as: 'donor' },
                { model: Campaign, as: 'campaign' }
            ]
        });
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donacioni nuk u gjet' 
            });
        }
        
        res.json({ success: true, data: donation });
    } catch (error) {
        console.error('Gabim ne getDonationById:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 3. KRIJO NJE DONACION TE RI
// ============================================
const createDonation = async (req, res) => {
    try {
        const { campaign_id, shuma, metoda_pageses, mesazhi, is_anonymous, transaction_id } = req.body;
        
        // Validimi
        if (!campaign_id || !shuma) {
            return res.status(400).json({
                success: false,
                message: 'Fushat campaign_id dhe shuma jane te detyrueshme'
            });
        }
        
        if (shuma <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Shuma duhet te jete me e madhe se 0'
            });
        }
        
        // Gjej ose krijo donor-in e lidhur me kete user
        let donor = await Donor.findOne({ where: { email: req.user.email } });
        
        if (!donor) {
            donor = await Donor.create({
                emri: req.user.firstName || 'User',
                mbiemri: req.user.lastName || '',
                email: req.user.email,
                user_id: req.user.id,
                total_dhuruar: 0,
                donation_count: 0
            });
            console.log('✅ Donatori i ri u krijua:', donor.id);
        }
        
        // Krijo donacionin
        const donation = await Donation.create({
            campaign_id,
            donor_id: donor.id,
            shuma,
            metoda_pageses: metoda_pageses || 'other',
            mesazhi: mesazhi || null,
            is_anonymous: is_anonymous || false,
            statusi: 'completed',
            transaction_id: transaction_id || null
        });
        
        console.log('✅ Donacioni u krijua:', donation.id);
        
        // Perditeso shumen e mbledhur te fushatës
        const campaign = await Campaign.findByPk(campaign_id);
        if (campaign) {
            const totalForCampaign = await Donation.sum('shuma', {
                where: { campaign_id: campaign_id, statusi: 'completed' }
            });
            await campaign.update({ shuma_mbledhur: totalForCampaign || 0 });
            console.log(`✅ Fushata ${campaign_id} u perditesua: ${totalForCampaign}€`);
        }
        
        // Perditeso totalin e donatorit
        const totalDonated = await Donation.sum('shuma', {
            where: { donor_id: donor.id, statusi: 'completed' }
        });
        const donationCount = await Donation.count({
            where: { donor_id: donor.id, statusi: 'completed' }
        });
        
        await donor.update({
            total_dhuruar: totalDonated || 0,
            donation_count: donationCount || 0
        });
        
        res.status(201).json({ 
            success: true, 
            data: donation,
            message: 'Donacioni u regjistrua me sukses! Faleminderit per kontributin!'
        });
        
    } catch (error) {
        console.error('Gabim ne createDonation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim gjate krijimit te donacionit: ' + error.message 
        });
    }
};

// ============================================
// 4. PERDITESO STATUSIN E NJE DONACIONI
// ============================================
const updateDonationStatus = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donacioni nuk u gjet' 
            });
        }
        
        const oldStatus = donation.statusi;
        const newStatus = req.body.statusi;
        
        await donation.update({ statusi: newStatus });
        
        // Nese statusi ndryshon nga 'pending' ne 'completed', perditeso totalet
        if (oldStatus === 'pending' && newStatus === 'completed') {
            const campaign = await Campaign.findByPk(donation.campaign_id);
            if (campaign) {
                const totalForCampaign = await Donation.sum('shuma', {
                    where: { campaign_id: donation.campaign_id, statusi: 'completed' }
                });
                await campaign.update({ shuma_mbledhur: totalForCampaign || 0 });
            }
            
            const donor = await Donor.findByPk(donation.donor_id);
            if (donor) {
                const totalDonated = await Donation.sum('shuma', {
                    where: { donor_id: donation.donor_id, statusi: 'completed' }
                });
                const donationCount = await Donation.count({
                    where: { donor_id: donation.donor_id, statusi: 'completed' }
                });
                await donor.update({
                    total_dhuruar: totalDonated || 0,
                    donation_count: donationCount || 0
                });
            }
        }
        
        res.json({ 
            success: true, 
            data: donation,
            message: `Statusi i donacionit u ndryshua ne ${newStatus}`
        });
        
    } catch (error) {
        console.error('Gabim ne updateDonationStatus:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 5. FSHIJ NJE DONACION
// ============================================
const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donacioni nuk u gjet' 
            });
        }
        
        // Para se te fshish, zbrit shumen nga fushata dhe donatori
        if (donation.statusi === 'completed') {
            const campaign = await Campaign.findByPk(donation.campaign_id);
            if (campaign) {
                const totalForCampaign = await Donation.sum('shuma', {
                    where: { campaign_id: donation.campaign_id, statusi: 'completed' }
                });
                await campaign.update({ shuma_mbledhur: totalForCampaign || 0 });
            }
            
            const donor = await Donor.findByPk(donation.donor_id);
            if (donor) {
                const totalDonated = await Donation.sum('shuma', {
                    where: { donor_id: donation.donor_id, statusi: 'completed' }
                });
                const donationCount = await Donation.count({
                    where: { donor_id: donation.donor_id, statusi: 'completed' }
                });
                await donor.update({
                    total_dhuruar: totalDonated || 0,
                    donation_count: donationCount || 0
                });
            }
        }
        
        await donation.destroy();
        
        res.json({ 
            success: true, 
            message: 'Donacioni u fshi me sukses' 
        });
        
    } catch (error) {
        console.error('Gabim ne deleteDonation:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 6. MERRI DONACIONET E NJE FUSHATE
// ============================================
const getDonationsByCampaign = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            where: { campaign_id: req.params.campaignId },
            include: [
                { model: Donor, as: 'donor', attributes: ['emri', 'mbiemri'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        console.error('Gabim ne getDonationsByCampaign:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 7. MERRI DONACIONET E NJE DONATORI
// ============================================
const getDonationsByDonor = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            where: { donor_id: req.params.donorId },
            include: [
                { model: Campaign, as: 'campaign', attributes: ['titulli'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        console.error('Gabim ne getDonationsByDonor:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonationStatus,
    deleteDonation,
    getDonationsByCampaign,
    getDonationsByDonor
};