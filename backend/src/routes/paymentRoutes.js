const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');


router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);


router.post('/create-payment-intent', express.json(), createPaymentIntent);

module.exports = router;