import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, campaignId, donorName, donorEmail, isAnonymous, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const user = authService.getCurrentUser();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            toast.error('Stripe nuk eshte gati');
            return;
        }
        
        setIsProcessing(true);
        toast.loading('Duke procesuar pagesen...', { id: 'payment' });
        
        try {
            // 1. Konfirmo pagesën me Stripe
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/donations`,
                    payment_method_data: {
                        billing_details: {
                            name: donorName,
                            email: donorEmail,
                        }
                    }
                },
                redirect: 'if_required'
            });
            
            if (error) {
                console.error('Gabim ne pagese:', error);
                toast.error(error.message, { id: 'payment' });
                setIsProcessing(false);
                return;
            }
            
            console.log('✅ Pagesa u krye!', paymentIntent);
            toast.loading('Pagesa u krye! Duke regjistruar donacionin...', { id: 'payment' });
            
            // 2. Krijo donacionin direkt pa marre donor-in me pare
            const donationData = {
                campaign_id: parseInt(campaignId),
                shuma: amount,
                metoda_pageses: 'karte_krediti',
                statusi: 'completed',
                transaction_id: paymentIntent.id,
                is_anonymous: isAnonymous
            };
            
            console.log('Duke ruajtur donacionin:', donationData);
            
            const donationResponse = await api.post('/donations', donationData);
            console.log('✅ Donacioni u ruajt:', donationResponse.data);
            
            toast.success('Faleminderit per donacionin!', { id: 'payment' });
            onSuccess && onSuccess();
            
        } catch (err) {
            console.error('Gabim i plote:', err);
            toast.error(err.response?.data?.message || 'Ndodhi nje gabim', { id: 'payment' });
            setIsProcessing(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Te dhenat e kartes</label>
                <PaymentElement />
            </div>
            <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Anulo
                </button>
                <button type="submit" className="btn btn-success" disabled={!stripe || isProcessing}>
                    {isProcessing ? 'Duke procesuar...' : `Dhuro €${amount}`}
                </button>
            </div>
        </form>
    );
};

const DonationCheckout = ({ amount, campaignId, donorName, donorEmail, isAnonymous, onSuccess, onClose }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const createPaymentIntent = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                console.log('Creating payment intent for:', { amount, campaignId, donorName, donorEmail });
                
                const response = await api.post('/payments/create-payment-intent', {
                    amount,
                    campaign_id: campaignId,
                    donor_name: donorName,
                    donor_email: donorEmail,
                    is_anonymous: isAnonymous
                });
                
                console.log('Response:', response.data);
                
                if (response.data.success) {
                    setClientSecret(response.data.clientSecret);
                } else {
                    setError(response.data.message || 'Gabim ne krijimin e pageses');
                }
            } catch (err) {
                console.error('Gabim:', err);
                setError(err.response?.data?.message || 'Gabim ne lidhje me serverin');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (amount > 0 && campaignId) {
            createPaymentIntent();
        }
    }, [amount, campaignId, donorName, donorEmail, isAnonymous]);
    
    if (isLoading) {
        return <div className="text-center py-3">Duke përgatitur pagesën...</div>;
    }
    
    if (error) {
        return (
            <div>
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={onClose}>Kthehu prapa</button>
            </div>
        );
    }
    
    if (!clientSecret) {
        return <div className="alert alert-warning">Nuk mund te inicializohet pagesa. Kontrollo që fushata ekziston.</div>;
    }
    
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
                amount={amount}
                campaignId={campaignId}
                donorName={donorName}
                donorEmail={donorEmail}
                isAnonymous={isAnonymous}
                onSuccess={onSuccess}
                onClose={onClose}
            />
        </Elements>
    );
};

export default DonationCheckout;