// Zëvendëso funksionet ekzistuese me këto

const Donation = require('../models/Donation');
// Komento përkohësisht modelet që mungojnë
// const Campaign = require('../models/Campaign');
// const Donor = require('../models/Donor');
const { sequelize } = require('../config/database');

// ============================================
// 1. MERRI TE GJITHA DONACIONET (VERSIONI I THJESHTE)
// ============================================
const getAllDonations = async (req, res) => {
    try {
        // Pa include për të shmangur gabimet
        const donations = await Donation.findAll({
            order: [['data', 'DESC']]
        });
        
        res.json({ 
            success: true, 
            count: donations.length, 
            data: donations 
        });
    } catch (error) {
        console.error('Gabim në getAllDonations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim gjatë marrjes së donacioneve: ' + error.message 
        });
    }
};

// ============================================
// 2. MERRI NJE DONACION SPECIFIK
// ============================================
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);
        
        if (!donation) {
            return res.status(404).json({ 
                success: false, 
                message: 'Donacioni nuk u gjet' 
            });
        }
        
        res.json({ success: true, data: donation });
    } catch (error) {
        console.error('Gabim në getDonationById:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ============================================
// 3. KRIJO NJE DONACION TE RI (VERSIONI I THJESHTE)
// ============================================
const createDonation = async (req, res) => {
    try {
        const { campaign_id, donor_id, shuma, metoda_pageses, mesazhi, is_anonymous } = req.body;
        
        // Validimi bazë
        if (!campaign_id || !donor_id || !shuma) {
            return res.status(400).json({
                success: false,
                message: 'Fushat campaign_id, donor_id dhe shuma janë të detyrueshme'
            });
        }
        
        if (shuma <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Shuma duhet të jetë më e madhe se 0'
            });
        }
        
        const donation = await Donation.create({
            campaign_id,
            donor_id,
            shuma,
            metoda_pageses: metoda_pageses || 'other',
            mesazhi: mesazhi || null,
            is_anonymous: is_anonymous || false,
            statusi: 'completed'
        });
        
        res.status(201).json({ 
            success: true, 
            data: donation,
            message: 'Donacioni u regjistrua me sukses! Faleminderit për kontributin!'
        });
        
    } catch (error) {
        console.error('Gabim në createDonation:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Gabim gjatë krijimit të donacionit: ' + error.message 
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
        
        const newStatus = req.body.statusi;
        await donation.update({ statusi: newStatus });
        
        res.json({ 
            success: true, 
            data: donation,
            message: `Statusi i donacionit u ndryshua në ${newStatus}`
        });
        
    } catch (error) {
        console.error('Gabim në updateDonationStatus:', error);
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
        
        await donation.destroy();
        
        res.json({ 
            success: true, 
            message: 'Donacioni u fshi me sukses' 
        });
        
    } catch (error) {
        console.error('Gabim në deleteDonation:', error);
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
            order: [['data', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        console.error('Gabim në getDonationsByCampaign:', error);
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
            order: [['data', 'DESC']]
        });
        
        res.json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        console.error('Gabim në getDonationsByDonor:', error);
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