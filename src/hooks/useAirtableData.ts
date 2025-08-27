import { useState, useEffect } from 'react';
import { Establishment } from '../types';
import { fetchEstablishmentsFromAirtable } from '../services/airtableService';
import { airtableConfig, validateAirtableConfig } from '../config/airtable';

export const useAirtableData = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAirtableConfigured, setIsAirtableConfigured] = useState(false);

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier la configuration Airtable
        const isConfigured = validateAirtableConfig();
        setIsAirtableConfigured(isConfigured);

        if (!isConfigured) {
          setError('Configuration Airtable manquante. Vérifiez vos variables d\'environnement.');
          return;
        }

        // Récupérer les données depuis Airtable
        const data = await fetchEstablishmentsFromAirtable();
        setEstablishments(data);
        
        console.log(`✅ ${data.length} établissements chargés depuis Airtable`);
      } catch (err) {
        console.error('❌ Erreur lors du chargement des données Airtable:', err);
        setError('Erreur lors du chargement des données depuis Airtable');
        
        // Fallback vers les données locales si Airtable échoue
        const { establishments: localEstablishments } = await import('../data/establishments');
        setEstablishments(localEstablishments);
        console.log('📦 Utilisation des données locales en fallback');
      } finally {
        setLoading(false);
      }
    };

    loadEstablishments();
  }, []);

  const refreshData = async () => {
    if (!isAirtableConfigured) return;
    
    try {
      setLoading(true);
      const data = await fetchEstablishmentsFromAirtable();
      setEstablishments(data);
      console.log('🔄 Données Airtable rafraîchies');
    } catch (err) {
      console.error('❌ Erreur lors du rafraîchissement:', err);
      setError('Erreur lors du rafraîchissement des données');
    } finally {
      setLoading(false);
    }
  };

  return {
    establishments,
    loading,
    error,
    isAirtableConfigured,
    refreshData
  };
};