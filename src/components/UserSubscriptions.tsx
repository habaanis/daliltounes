import React, { useState, useEffect } from 'react';
import { Crown, Calendar, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../hooks/useLanguage';

interface Subscription {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'active' | 'cancelled' | 'expired';
  created_at: string;
  expires_at: string;
}

interface UserSubscriptionsProps {
  userEmail: string;
}

const UserSubscriptions: React.FC<UserSubscriptionsProps> = ({ userEmail }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    fetchSubscriptions();
  }, [userEmail]);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'expired':
        return 'Expiré';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className={`flex items-center space-x-3 mb-6 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
        <Crown className="h-6 w-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-gray-900">Mes Abonnements</h3>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun abonnement trouvé</p>
          <p className="text-sm text-gray-500 mt-2">
            Souscrivez à un plan pour accéder aux fonctionnalités premium
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                  {getStatusIcon(subscription.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900">{subscription.plan_name}</h4>
                    <p className="text-sm text-gray-600">
                      {subscription.amount} {subscription.currency}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {getStatusText(subscription.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Date de souscription:</span>
                  <p>{formatDate(subscription.created_at)}</p>
                </div>
                <div>
                  <span className="font-medium">Date d'expiration:</span>
                  <p>{formatDate(subscription.expires_at)}</p>
                </div>
              </div>

              {subscription.status === 'active' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Gérer l'abonnement
                    </button>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSubscriptions;