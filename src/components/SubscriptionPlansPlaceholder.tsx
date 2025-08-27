import React from 'react';
import { Crown, Clock, CheckCircle, Star } from 'lucide-react';

const SubscriptionPlansPlaceholder: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-full">
                  <Crown className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Fonctionnalités Premium
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Les abonnements et fonctionnalités premium seront bientôt disponibles !<br />
                En attendant, profitez de toutes les fonctionnalités gratuites.
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-8 border border-blue-100">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-900">Bientôt disponible</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">Pour les Entreprises</h4>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Plans d'abonnement flexibles</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Badge "Vérifié" premium</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Mise en avant dans les résultats</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Statistiques détaillées</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg">Pour les Touristes</h4>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Guides touristiques exclusifs</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Réductions partenaires</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Concierge virtuel</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">Support prioritaire</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-xl mb-6">
                <div className="flex items-center justify-center space-x-3">
                  <Star className="h-6 w-6 fill-current" />
                  <p className="font-bold text-lg">
                    En attendant, profitez de toutes les fonctionnalités gratuites !
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>Les paiements seront activés dès que notre système Stripe sera opérationnel.</p>
                <p className="mt-1">Restez connectés pour les mises à jour ! 🚀</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPlaceholder;