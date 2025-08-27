import { useState, useEffect } from 'react';
import { Establishment } from '../types';
import { fetchEstablishmentsFromSupabase } from '../services/supabaseEstablishments';
import { config, validateEnvironment } from '../config/environment';

export const useSupabaseData = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier la configuration Supabase
        const isConfigured = validateEnvironment();
        setIsSupabaseConfigured(isConfigured);

        if (!isConfigured) {
          setError('Configuration Supabase manquante. Vérifiez vos variables d\'environnement.');
          // Fallback vers les données locales
          const { establishments: localEstablishments } = await import('../data/establishments');
          setEstablishments(localEstablishments);
          return;
        }

        // Récupérer les données depuis Supabase
        const data = await fetchEstablishmentsFromSupabase();
        
        if (data.length === 0) {
          console.log('⚠️ Aucun établissement dans Supabase, utilisation des données locales');
          const { establishments: localEstablishments } = await import('../data/establishments');
          setEstablishments(localEstablishments);
          setError('Aucun établissement trouvé dans Supabase. Utilisation des données de démonstration.');
        } else {
          setEstablishments(data);
          console.log(`✅ ${data.length} établissements chargés depuis Supabase`);
        }
        
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données Supabase:', err);
        setError('Erreur lors du chargement des données depuis Supabase');
        
        // Fallback vers les données locales si Supabase échoue
        try {
          const { establishments: localEstablishments } = await import('../data/establishments');
          setEstablishments(localEstablishments);
          console.log('📦 Utilisation des données locales en fallback');
        } catch (fallbackError) {
          console.error('❌ Erreur lors du chargement des données locales:', fallbackError);
          setEstablishments([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  const refreshData = async () => {
    if (!isSupabaseConfigured) return;
    
    try {
      setLoading(true);
      const data = await fetchEstablishmentsFromSupabase();
      setEstablishments(data);
      console.log('🔄 Données Supabase rafraîchies');
    } catch (err) {
      console.error('❌ Erreur lors du rafraîchissement:', err);
      setError('Erreur lors du rafraîchissement des données');
    } finally {
      setLoading(false);
    }
  };

  const addEstablishment = async (establishment: Partial<Establishment>) => {
    try {
      const { addEstablishmentToSupabase } = await import('../services/supabaseEstablishments');
      const newId = await addEstablishmentToSupabase(establishment);
      
      if (newId) {
        // Rafraîchir les données après ajout
        await refreshData();
        return newId;
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      return null;
    }
  };

  return {
    establishments,
    loading,
    error,
    isSupabaseConfigured,
    refreshData,
    addEstablishment
  };
};