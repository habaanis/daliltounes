import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  status: 'active' | 'cancelled' | 'expired';
  expires_at: string;
}

export const useSubscription = (userEmail?: string) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [userEmail]);

  const fetchSubscription = async () => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_email', userEmail)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      if (data && data.length > 0) {
        setSubscription(data[0]);
        setHasActiveSubscription(true);
      } else {
        setSubscription(null);
        setHasActiveSubscription(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si l'utilisateur peut voir les informations de contact
  const canViewContactInfo = (establishmentCategory: string): boolean => {
    // Pour les hôtels et restaurants, il faut un abonnement actif
    if (establishmentCategory === 'hotel' || establishmentCategory === 'alimentation') {
      return hasActiveSubscription;
    }
    
    // Pour les autres catégories, l'accès est libre
    return true;
  };

  // Fonction pour vérifier si l'utilisateur peut voir les services détaillés
  const canViewServices = (establishmentCategory: string): boolean => {
    // Même logique que pour les informations de contact
    return canViewContactInfo(establishmentCategory);
  };

  return {
    subscription,
    loading,
    hasActiveSubscription,
    canViewContactInfo,
    canViewServices,
    refetch: fetchSubscription
  };
};