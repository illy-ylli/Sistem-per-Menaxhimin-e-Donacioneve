const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
    console.log('=== CREATE PAYMENT INTENT ===');
    console.log('req.body:', req.body);
    
    try {
        // Merre amount nga body ose nga query params
        let { amount, campaign_id, donor_name, donor_email } = req.body;
        
        // Nëse amount nuk është në body, kontrollo në query params
        if (!amount && req.query) {
            amount = req.query.amount;
        }
        
        console.log('Amount e pare:', amount);
        
        // Konverto amount në numër nëse është string
        if (typeof amount === 'string') {
            amount = parseFloat(amount);
        }
        
        console.log('Amount pas konvertimit:', amount);
        
        // Validimi
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Shuma duhet te jete me e madhe se 0',
                receivedAmount: amount
            });
        }
        
        // Konverto shumen ne cent
        const amountInCents = Math.round(amount * 100);
        
        console.log(`Amount ne cent: ${amountInCents}`);
        
        // Kontrollo nese Stripe key eshte vendosur
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY nuk eshte vendosur!');
            return res.status(500).json({
                success: false,
                message: 'Stripe nuk eshte konfiguruar ne server'
            });
        }
        
        // Krijo PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            metadata: {
                campaign_id: campaign_id?.toString() || '',
                donor_name: donor_name || 'Anonim',
                donor_email: donor_email || ''
            }
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

module.exports = { createPaymentIntent };