const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');

// Webhook duhet të jetë PARA express.json()
// Kjo trajton trupin e kërkesës si raw buffer
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Rruga normale për create-payment-intent
router.post('/create-payment-intent', express.json(), createPaymentIntent);

module.exports = router;