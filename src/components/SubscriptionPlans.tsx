import React, { useState } from 'react';
import { Check, Crown, Star, Users, Briefcase } from 'lucide-react';
import { subscriptionPlans } from '../data/subscriptions';
import { useLanguage } from '../hooks/useLanguage';
import PaymentModal from './PaymentModal';
import { SubscriptionPlan } from '../types';

const SubscriptionPlans: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<'business' | 'tourist'>('business');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { t, isRTL } = useLanguage();

  const filteredPlans = subscriptionPlans.filter(plan => plan.target === selectedTarget);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleClosePayment = () => {
    setSelectedPlan(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 ${isRTL ? 'font-arabic' : ''}`}>
            {t('subscriptionTitle')}
          </h2>
          <p className={`text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 ${isRTL ? 'font-arabic' : ''} leading-relaxed`}>
            {t('subscriptionSubtitle')}
          </p>
          
          {/* Target selector */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-200">
              <button
                onClick={() => setSelectedTarget('business')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl transition-all duration-300 ${
                  selectedTarget === 'business'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${isRTL ? 'space-x-reverse' : ''}`}
              >
                <Briefcase className="h-6 w-6" />
                <span className="font-semibold">Entreprises</span>
              </button>
              <button
                onClick={() => setSelectedTarget('tourist')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl transition-all duration-300 ${
                  selectedTarget === 'tourist'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${isRTL ? 'space-x-reverse' : ''}`}
              >
                <Users className="h-6 w-6" />
                <span className="font-semibold">Touristes</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-2xl overflow-hidden relative hover:scale-105 transition-all duration-300 border ${
                plan.popular ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105 border-blue-200' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3">
                  <div className={`flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    <Star className="h-5 w-5 fill-current animate-pulse" />
                    <span className="text-sm font-bold">{t('popular')}</span>
                  </div>
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                <div className="text-center mb-8">
                  <div className={`flex items-center justify-center space-x-2 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    {plan.id.includes('enterprise') && <Crown className="h-7 w-7 text-yellow-500" />}
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {plan.price} DT
                    <span className="text-lg font-normal text-gray-600">/{plan.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`flex items-start space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5 bg-green-100 rounded-full p-1" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full py-4 px-8 rounded-xl font-bold transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-blue-100 hover:to-blue-200'
                  }`}
                >
                  {t('choosePlan')}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            Besoin d'aide pour choisir ? Contactez-nous pour un conseil personnalisé
          </p>
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-10 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105 transform">
            {t('contact')}
          </button>
        </div>
      </div>
      
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={handleClosePayment}
        />
      )}
    </div>
  );
};

export default SubscriptionPlans;