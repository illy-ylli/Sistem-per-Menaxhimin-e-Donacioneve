const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Donor = require('../models/Donor');
const { sequelize } = require('../config/database');

// ============================================
// 1. KRIJO PAYMENTINTENT (për frontend-in)
// ============================================
const createPaymentIntent = async (req, res) => {
    console.log('=== CREATE PAYMENT INTENT ===');
    console.log('req.body:', req.body);
    
    try {
        let { amount, campaign_id, donor_name, donor_email, is_anonymous } = req.body;
        
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Shuma duhet te jete me e madhe se 0'
            });
        }
        
        const amountInCents = Math.round(amount * 100);
        
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY nuk eshte vendosur!');
            return res.status(500).json({
                success: false,
                message: 'Stripe nuk eshte konfiguruar'
            });
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            metadata: {
                campaign_id: campaign_id?.toString() || '',
                donor_name: donor_name || 'Anonim',
                donor_email: donor_email || '',
                is_anonymous: is_anonymous ? 'true' : 'false'
            },
            receipt_email: donor_email
        });
        
        console.log('PaymentIntent created:', paymentIntent.id);
        
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
        
    } catch (error) {
        console.error('Gabim ne createPaymentIntent:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// 2. WEBHOOK - thirret nga Stripe pas pagesës
// ============================================
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    
    try {
        if (webhookSecret && webhookSecret !== '') {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
            // Për zhvillim lokal - anashkalo verifikimin
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    console.log('Event type:', event.type);
    
    // Trajto pagesën e suksesshme
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
        
        console.log(`✅ Pagesa u krye: ${paymentIntent.id}`);
        console.log(`Shuma: ${paymentIntent.amount / 100}€`);
        console.log(`Fushata ID: ${metadata.campaign_id}`);
        console.log(`Donatori: ${metadata.donor_name}`);
        
        const transaction = await sequelize.transaction();
        
        try {
            // Kontrollo nëse donacioni ekziston tashmë (për të shmangur dublikimet)
            const existingDonation = await Donation.findOne({
                where: { transaction_id: paymentIntent.id }
            });
            
            if (existingDonation) {
                console.log(`⚠️ Donacioni ekziston tashmë: ${paymentIntent.id}`);
                await transaction.rollback();
                return res.json({ received: true, message: 'Duplicate ignored' });
            }
            
            // Gjej ose krijo donatorin
            let donor = await Donor.findOne({
                where: { email: metadata.donor_email }
            });
            
            if (!donor) {
                const emriParts = (metadata.donor_name || 'Anonim').split(' ');
                donor = await Donor.create({
                    emri: emriParts[0] || 'Anonim',
                    mbiemri: emriParts.slice(1).join(' ') || '',
                    email: metadata.donor_email || `anonim_${Date.now()}@temp.com`,
                    telefoni: null,
                    adresa: null
                }, { transaction });
                console.log(`✅ Donatori i ri u krijua: ID ${donor.id}`);
            } else {
                console.log(`✅ Donatori ekzistues: ID ${donor.id}`);
            }
            
            // Krijo donacionin
            const donation = await Donation.create({
                campaign_id: parseInt(metadata.campaign_id),
                donor_id: donor.id,
                shuma: paymentIntent.amount / 100,
                metoda_pageses: 'karte_krediti',
                statusi: 'completed',
                transaction_id: paymentIntent.id,
                is_anonymous: metadata.is_anonymous === 'true',
                mesazhi: null
            }, { transaction });
            
            console.log(`✅ Donacioni u krijua: ID ${donation.id}`);
            
            // Përditëso shumën e mbledhur të fushatës
            const campaign = await Campaign.findByPk(parseInt(metadata.campaign_id));
            if (campaign) {
                const currentCollected = parseFloat(campaign.shuma_mbledhur || 0);
                const newCollected = currentCollected + (paymentIntent.amount / 100);
                await campaign.update({ shuma_mbledhur: newCollected }, { transaction });
                console.log(`✅ Fushata u përditësua: shuma_mbledhur = ${newCollected}€`);
            } else {
                console.log(`⚠️ Fushata me ID ${metadata.campaign_id} nuk u gjet!`);
            }
            
            // Përditëso totalin e donatorit
            const currentTotal = parseFloat(donor.total_dhuruar || 0);
            const currentCount = donor.donation_count || 0;
            await donor.update({
                total_dhuruar: currentTotal + (paymentIntent.amount / 100),
                donation_count: currentCount + 1
            }, { transaction });
            
            await transaction.commit();
            console.log(`✅ DONACIONI U REGJISTRUA ME SUKSES!`);
            
        } catch (error) {
            await transaction.rollback();
            console.error('❌ Gabim në regjistrimin e donacionit:', error);
        }
    }
    
    // Trajto pagesën e dështuar
    if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object;
        console.log(`❌ Pagesa dështoi: ${paymentIntent.id}`);
        console.log(`Arsyeja: ${paymentIntent.last_payment_error?.message || 'I panjohur'}`);
    }
    
    res.json({ received: true });
};

module.exports = { createPaymentIntent, handleWebhook };