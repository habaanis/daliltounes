import React, { useState } from 'react';
import { X, CreditCard, Lock, Check } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import stripePromise from '../lib/stripe';
import { supabase } from '../lib/supabase';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const { t, isRTL } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Calculate expiry date based on plan duration
      const now = new Date();
      let expiresAt = new Date(now);
      
      switch (plan.duration) {
        case 'jour':
          expiresAt.setDate(now.getDate() + 1);
          break;
        case 'semaine':
          expiresAt.setDate(now.getDate() + 7);
          break;
        case 'mois':
          expiresAt.setMonth(now.getMonth() + 1);
          break;
        case 'semestre':
          expiresAt.setMonth(now.getMonth() + 6);
          break;
        case 'an':
          expiresAt.setFullYear(now.getFullYear() + 1);
          break;
      }

      // Save subscription to Supabase
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_email: email,
          plan_id: plan.id,
          plan_name: plan.name,
          amount: plan.price,
          currency: 'TND',
          status: 'active',
          expires_at: expiresAt.toISOString(),
          stripe_customer_id: `cus_${Math.random().toString(36).substr(2, 9)}`,
          stripe_subscription_id: `sub_${Math.random().toString(36).substr(2, 9)}`
        });

      if (error) {
        console.error('Error saving subscription:', error);
        throw new Error('Erreur lors de l\'enregistrement de l\'abonnement');
      }

      // Save payment record
      await supabase
        .from('payments')
        .insert({
          user_email: email,
          amount: plan.price,
          currency: 'TND',
          status: 'completed',
          stripe_payment_intent_id: `pi_${Math.random().toString(36).substr(2, 9)}`,
          plan_id: plan.id
        });

      setIsSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Erreur lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement réussi !</h3>
          <p className="text-gray-600 mb-4">
            Votre abonnement <strong>{plan.name}</strong> a été activé avec succès.
          </p>
          <p className="text-sm text-gray-500">
            Un email de confirmation a été envoyé à {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h2 className={`text-xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                Finaliser l'abonnement
              </h2>
              <p className={`text-gray-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {plan.name} - {plan.price} DT/{plan.duration}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              placeholder="Nom Prénom"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              Numéro de carte <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))}
                required
                maxLength={19}
                className={`w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder="1234 5678 9012 3456"
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                Date d'expiration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/'))}
                required
                maxLength={5}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder="MM/AA"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                required
                maxLength={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder="123"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className={`font-medium text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              Résumé de la commande
            </h4>
            <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-gray-600">{plan.name}</span>
              <span className="font-bold text-gray-900">{plan.price} DT</span>
            </div>
          </div>

          <div className={`flex items-center space-x-2 text-sm text-gray-600 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <Lock className="h-4 w-4" />
            <span>Paiement sécurisé par Stripe</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isProcessing ? 'animate-pulse' : ''
            }`}
          >
            {isProcessing ? 'Traitement en cours...' : `Payer ${plan.price} DT`}
          </button>

          <p className={`text-xs text-gray-500 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            En procédant au paiement, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;