import { supabase } from '../lib/supabase';
import { Establishment, EstablishmentCategory, Governorate } from '../types';

export interface SupabaseEstablishment {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  address: string;
  governorate: string;
  district?: string;
  phone: string;
  email?: string;
  website?: string;
  image?: string;
  rating?: number;
  review_count?: number;
  hours?: string;
  services?: string[];
  latitude: number;
  longitude: number;
  verified?: boolean;
  premium?: boolean;
  created_at: string;
  updated_at: string;
}

// Mapper les données Supabase vers notre format
const mapSupabaseToEstablishment = (record: SupabaseEstablishment): Establishment => {
  return {
    id: record.id,
    name: record.name,
    category: record.category as EstablishmentCategory,
    subcategory: record.subcategory,
    description: record.description,
    address: record.address,
    governorate: record.governorate as Governorate,
    phone: record.phone,
    email: record.email || '',
    website: record.website || '',
    image: record.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    rating: record.rating || 4.0,
    reviewCount: record.review_count || 0,
    hours: record.hours || '09:00 - 18:00',
    services: record.services || [],
    coordinates: {
      lat: record.latitude,
      lng: record.longitude
    },
    verified: record.verified || false,
    premium: record.premium || false
  };
};

// Récupérer tous les établissements depuis Supabase
export const fetchEstablishmentsFromSupabase = async (): Promise<Establishment[]> => {
  try {
    console.log('🔄 Récupération des établissements depuis Supabase...');
    
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Aucun établissement trouvé dans Supabase');
      return [];
    }

    console.log(`✅ ${data.length} établissements récupérés depuis Supabase`);
    
    return data.map(mapSupabaseToEstablishment);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération depuis Supabase:', error);
    throw new Error('Impossible de récupérer les données depuis Supabase');
  }
};

// Récupérer un établissement spécifique
export const fetchEstablishmentById = async (id: string): Promise<Establishment | null> => {
  try {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Erreur lors de la récupération de l\'établissement:', error);
      return null;
    }

    return mapSupabaseToEstablishment(data);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'établissement:', error);
    return null;
  }
};

// Ajouter un nouvel établissement (suggestion)
export const addEstablishmentToSupabase = async (establishment: Partial<Establishment>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('establishments')
      .insert({
        name: establishment.name,
        category: establishment.category,
        subcategory: establishment.subcategory,
        description: establishment.description,
        address: establishment.address,
        governorate: establishment.governorate,
        district: establishment.governorate === 'tunis' ? 'centre-ville' : null,
        phone: establishment.phone,
        email: establishment.email,
        website: establishment.website,
        hours: establishment.hours,
        services: establishment.services || [],
        latitude: establishment.coordinates?.lat || 36.8065,
        longitude: establishment.coordinates?.lng || 10.1815,
        verified: false, // Nouvelles suggestions non vérifiées
        premium: false
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur lors de l\'ajout à Supabase:', error);
      return null;
    }

    console.log('✅ Établissement ajouté à Supabase:', data.id);
    return data.id;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout à Supabase:', error);
    return null;
  }
};

// Rechercher des établissements
export const searchEstablishments = async (query: string): Promise<Establishment[]> => {
  try {
    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,subcategory.ilike.%${query}%,address.ilike.%${query}%`)
      .order('rating', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la recherche:', error);
      return [];
    }

    return data.map(mapSupabaseToEstablishment);
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    return [];
  }
};

// Filtrer les établissements
export const filterEstablishments = async (filters: {
  category?: string;
  governorate?: string;
  verified?: boolean;
  premium?: boolean;
  minRating?: number;
}): Promise<Establishment[]> => {
  try {
    let query = supabase.from('establishments').select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.governorate) {
      query = query.eq('governorate', filters.governorate);
    }
    
    if (filters.verified !== undefined) {
      query = query.eq('verified', filters.verified);
    }
    
    if (filters.premium !== undefined) {
      query = query.eq('premium', filters.premium);
    }
    
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors du filtrage:', error);
      return [];
    }

    return data.map(mapSupabaseToEstablishment);
  } catch (error) {
    console.error('❌ Erreur lors du filtrage:', error);
    return [];
  }
};