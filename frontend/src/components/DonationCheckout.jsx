import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ amount, campaignId, donorName, donorEmail, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!stripe || !elements) {
            toast.error('Stripe nuk eshte gati');
            return;
        }
        
        setIsProcessing(true);
        
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/donations`,
            },
            redirect: 'if_required'
        });
        
        if (error) {
            toast.error(error.message);
            setIsProcessing(false);
        } else {
            toast.success('Donacioni u krye me sukses! Faleminderit!');
            onSuccess && onSuccess();
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
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

const DonationCheckout = ({ amount, campaignId, donorName, donorEmail, onSuccess, onClose }) => {
    const [clientSecret, setClientSecret] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                const response = await api.post('/payments/create-payment-intent', {
                    amount,
                    campaign_id: campaignId,
                    donor_name: donorName,
                    donor_email: donorEmail
                });
                
                if (response.data.success) {
                    setClientSecret(response.data.clientSecret);
                }
            } catch (error) {
                toast.error('Gabim ne lidhje me pagesen');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (amount > 0) {
            createPaymentIntent();
        }
    }, [amount, campaignId, donorName, donorEmail]);
    
    if (isLoading) {
        return <div className="text-center py-3">Duke përgatitur pagesën...</div>;
    }
    
    if (!clientSecret) {
        return <div className="alert alert-danger">Gabim ne inicializimin e pageses</div>;
    }
    
    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
                amount={amount}
                campaignId={campaignId}
                donorName={donorName}
                donorEmail={donorEmail}
                onSuccess={onSuccess}
                onClose={onClose}
            />
        </Elements>
    );
};

export default DonationCheckout;