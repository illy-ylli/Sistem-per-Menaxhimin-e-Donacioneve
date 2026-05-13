const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');  // Do ta krijoni me vone
const Donor = require('../models/Donor');        // Do ta krijoni me vone
const { sequelize } = require('../config/database');

// ============================================
// 1. MERRI TE GJITHA DONACIONET
// ============================================
// Perdorimi: GET /api/donations
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            include: [
                { model: Campaign, attributes: ['titulli'] },  // Merr titullin e fushatës
                { model: Donor, attributes: ['emri', 'mbiemri', 'eshte_anonim'] }
            ],
            order: [['data', 'DESC']]  // Me te rejat te parat
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 2. MERRI NJE DONACION SPECIFIK
// ============================================
// Perdorimi: GET /api/donations/:id
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id, {
            include: [
                { model: Campaign },
                { model: Donor }
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
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 3. KRIJO NJE DONACION TE RI
// ============================================
// Perdorimi: POST /api/donations
// Kush mund ta perdore: Cdo perdorues i autentikuar (ose edhe i paautentikuar neqoftese lejohet)
const createDonation = async (req, res) => {
    // Perdorim transaction per te siguruar qe te gjitha ndryshimet behen se bashku
    const transaction = await sequelize.transaction();
    
    try {
        const { campaign_id, donor_id, shuma, metoda_pageses, mesazhi, is_anonymous } = req.body;
        
        // Verifiko qe fushata ekziston dhe eshte aktive
        const campaign = await Campaign.findByPk(campaign_id);
        if (!campaign) {
            await transaction.rollback();
            return res.status(404).json({ 
                success: false, 
                message: 'Fushata nuk u gjet' 
            });
        }
        
        // Verifiko qe donatori ekziston
        const donor = await Donor.findByPk(donor_id);
        if (!donor) {
            await transaction.rollback();
            return res.status(404).json({ 
                success: false, 
                message: 'Donatori nuk u gjet' 
            });
        }
        
        // Krijo donacionin
        const donation = await Donation.create({
            campaign_id,
            donor_id,
            shuma,
            metoda_pageses,
            mesazhi,
            is_anonymous: is_anonymous || false,
            statusi: 'completed'  // Ne sistemin tone demo, i konsiderojme te perfunduara menjehere
        }, { transaction });
        
        // Perditeso shumen totale te mbledhur te fushatës
        const newCollected = parseFloat(campaign.shuma_mbledhur) + parseFloat(shuma);
        await campaign.update({ shuma_mbledhur: newCollected }, { transaction });
        
        // Perditeso totalin e donacioneve te donatorit
        const newTotal = parseFloat(donor.total_dhuruar) + parseFloat(shuma);
        const newCount = donor.donation_count + 1;
        await donor.update({
            total_dhuruar: newTotal,
            donation_count: newCount
        }, { transaction });
        
        // Neqoftese fushata e ka arritur target-in, perditeso statusin
        if (campaign.shuma_target <= newCollected) {
            await campaign.update({ statusi: 'perfunduar' }, { transaction });
        }
        
        await transaction.commit();
        
        res.status(201).json({ 
            success: true, 
            data: donation,
            message: 'Donacioni u regjistrua me sukses! Faleminderit per kontributin!'
        });
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 4. PERDITESO STATUSIN E NJE DONACIONI
// ============================================
// Perdorimi: PUT /api/donations/:id
// Kush mund ta perdore: Vetem admin (per te ndryshuar statusin)
const updateDonationStatus = async (req, res) => {
    const transaction = await sequelize.transaction();
    
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
        
        // Neqoftese statusi po ndryshon nga 'pending' ne 'completed', perditeso totalet
        if (oldStatus === 'pending' && newStatus === 'completed') {
            const campaign = await Campaign.findByPk(donation.campaign_id);
            const donor = await Donor.findByPk(donation.donor_id);
            
            if (campaign) {
                const newCollected = parseFloat(campaign.shuma_mbledhur) + parseFloat(donation.shuma);
                await campaign.update({ shuma_mbledhur: newCollected }, { transaction });
            }
            
            if (donor) {
                const newTotal = parseFloat(donor.total_dhuruar) + parseFloat(donation.shuma);
                const newCount = donor.donation_count + 1;
                await donor.update({
                    total_dhuruar: newTotal,
                    donation_count: newCount
                }, { transaction });
            }
        }
        
        // Neqoftese statusi po ndryshon nga 'completed' ne 'refunded', zbrit totalet
        if (oldStatus === 'completed' && newStatus === 'refunded') {
            const campaign = await Campaign.findByPk(donation.campaign_id);
            const donor = await Donor.findByPk(donation.donor_id);
            
            if (campaign) {
                const newCollected = parseFloat(campaign.shuma_mbledhur) - parseFloat(donation.shuma);
                await campaign.update({ shuma_mbledhur: newCollected }, { transaction });
            }
            
            if (donor) {
                const newTotal = parseFloat(donor.total_dhuruar) - parseFloat(donation.shuma);
                const newCount = donor.donation_count - 1;
                await donor.update({
                    total_dhuruar: newTotal,
                    donation_count: newCount
                }, { transaction });
            }
        }
        
        await donation.update({ statusi: newStatus }, { transaction });
        await transaction.commit();
        
        res.json({ 
            success: true, 
            data: donation,
            message: `Statusi i donacionit u ndryshua ne ${newStatus}`
        });
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 5. FSHIJ NJE DONACION
// ============================================
// Perdorimi: DELETE /api/donations/:id
// Kush mund ta perdore: Vetem admin
const deleteDonation = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const donation = await Donation.findByPk(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donacioni nuk u gjet' 
            });
        }
        
        // Neqoftese donacioni ishte i perfunduar, zbrit shumen nga totalet
        if (donation.statusi === 'completed') {
            const campaign = await Campaign.findByPk(donation.campaign_id);
            const donor = await Donor.findByPk(donation.donor_id);
            
            if (campaign) {
                const newCollected = parseFloat(campaign.shuma_mbledhur) - parseFloat(donation.shuma);
                await campaign.update({ shuma_mbledhur: Math.max(0, newCollected) }, { transaction });
            }
            
            if (donor) {
                const newTotal = parseFloat(donor.total_dhuruar) - parseFloat(donation.shuma);
                const newCount = donor.donation_count - 1;
                await donor.update({
                    total_dhuruar: Math.max(0, newTotal),
                    donation_count: Math.max(0, newCount)
                }, { transaction });
            }
        }
        
        await donation.destroy({ transaction });
        await transaction.commit();
        
        res.json({ 
            success: true, 
            message: 'Donacioni u fshi me sukses' 
        });
        
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 6. MERRI DONACIONET E NJE FUSHATE
// ============================================
// Perdorimi: GET /api/donations/campaign/:campaignId
const getDonationsByCampaign = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            where: { campaign_id: req.params.campaignId },
            include: [{ model: Donor, attributes: ['emri', 'mbiemri', 'eshte_anonim'] }],
            order: [['data', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ============================================
// 7. MERRI DONACIONET E NJE DONATORI
// ============================================
// Perdorimi: GET /api/donations/donor/:donorId
const getDonationsByDonor = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            where: { donor_id: req.params.donorId },
            include: [{ model: Campaign, attributes: ['titulli'] }],
            order: [['data', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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