import { loadStripe } from '@stripe/stripe-js';
import { config } from '../config/environment';

// This is your test publishable API key.
const stripePromise = loadStripe(config.stripe.publishableKey || 'pk_test_...');

export default stripePromise;

export const formatPrice = (amount: number, currency = 'TND') => {
  return new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};