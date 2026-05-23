const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonationStatus,
    deleteDonation,
    getDonationsByCampaign,
    getDonationsByDonor
} = require('../controllers/donationController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, campaign_id, donor_name, donor_email } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe përdor cent (50€ = 5000 cent)
      currency: 'eur',
      metadata: {
        campaign_id: campaign_id,
        donor_name: donor_name,
        donor_email: donor_email
      },
      receipt_email: donor_email // Stripe mund të dërgojë faturë automatikisht
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ============================================
// ROUTES PER DONACIONET
// ============================================

// GET /api/donations - Merr te gjitha donacionet
// POST /api/donations - Krijo nje donacion te ri (cdo perdorues i autentikuar)
router.route('/')
    .get(protect, getAllDonations)
    .post(protect, createDonation);

// GET /api/donations/campaign/:campaignId - Donacionet e nje fushate
router.get('/campaign/:campaignId', protect, getDonationsByCampaign);

// GET /api/donations/donor/:donorId - Donacionet e nje donatori
router.get('/donor/:donorId', protect, getDonationsByDonor);

// GET /api/donations/:id - Merr nje donacion specifik
// PUT /api/donations/:id - Perditeso statusin e donacionit (vetem admin)
// DELETE /api/donations/:id - Fshi nje donacion (vetem admin)
router.route('/:id')
    .get(protect, getDonationById)
    .put(protect, authorize('admin'), updateDonationStatus)
    .delete(protect, authorize('admin'), deleteDonation);

module.exports = router;