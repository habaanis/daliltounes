import Airtable from 'airtable';
import { airtableConfig } from '../config/airtable';
import { Establishment, EstablishmentCategory, Governorate } from '../types';

// Configuration Airtable
const base = new Airtable({ apiKey: airtableConfig.apiKey }).base(airtableConfig.baseId);

export interface AirtableEstablishment {
  id: string;
  fields: {
    Name: string;
    Category: string;
    Subcategory: string;
    Description: string;
    Address: string;
    Governorate: string;
    Phone: string;
    Email?: string;
    Website?: string;
    Image?: string;
    Rating?: number;
    ReviewCount?: number;
    Hours?: string;
    Services?: string;
    Latitude?: number;
    Longitude?: number;
    Verified?: boolean;
    Premium?: boolean;
  };
}

// Mapper les données Airtable vers notre format
const mapAirtableToEstablishment = (record: AirtableEstablishment): Establishment => {
  return {
    id: record.id,
    name: record.fields.Name || '',
    category: (record.fields.Category?.toLowerCase() as EstablishmentCategory) || 'divers',
    subcategory: record.fields.Subcategory || '',
    description: record.fields.Description || '',
    address: record.fields.Address || '',
    governorate: (record.fields.Governorate?.toLowerCase().replace(' ', '-') as Governorate) || 'tunis',
    phone: record.fields.Phone || '',
    email: record.fields.Email || '',
    website: record.fields.Website || '',
    image: record.fields.Image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    rating: record.fields.Rating || 4.0,
    reviewCount: record.fields.ReviewCount || 0,
    hours: record.fields.Hours || '09:00 - 18:00',
    services: record.fields.Services ? record.fields.Services.split(',').map(s => s.trim()) : [],
    coordinates: {
      lat: record.fields.Latitude || 36.8065,
      lng: record.fields.Longitude || 10.1815
    },
    verified: record.fields.Verified || false,
    premium: record.fields.Premium || false
  };
};

// Récupérer tous les établissements depuis Airtable
export const fetchEstablishmentsFromAirtable = async (): Promise<Establishment[]> => {
  try {
    console.log('🔄 Récupération des établissements depuis Airtable...');
    
    const records: AirtableEstablishment[] = [];
    
    await base(airtableConfig.tableName)
      .select({
        maxRecords: 1000, // Limite à 1000 enregistrements
        view: 'Grid view' // Vue par défaut
      })
      .eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords as AirtableEstablishment[]);
        fetchNextPage();
      });

    console.log(`✅ ${records.length} établissements récupérés depuis Airtable`);
    
    return records.map(mapAirtableToEstablishment);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération depuis Airtable:', error);
    throw new Error('Impossible de récupérer les données depuis Airtable');
  }
};

// Récupérer un établissement spécifique
export const fetchEstablishmentById = async (id: string): Promise<Establishment | null> => {
  try {
    const record = await base(airtableConfig.tableName).find(id) as AirtableEstablishment;
    return mapAirtableToEstablishment(record);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'établissement:', error);
    return null;
  }
};

// Ajouter un nouvel établissement (suggestion)
export const addEstablishmentToAirtable = async (establishment: Partial<Establishment>): Promise<string | null> => {
  try {
    const record = await base(airtableConfig.tableName).create({
      Name: establishment.name,
      Category: establishment.category,
      Subcategory: establishment.subcategory,
      Description: establishment.description,
      Address: establishment.address,
      Governorate: establishment.governorate,
      Phone: establishment.phone,
      Email: establishment.email,
      Website: establishment.website,
      Hours: establishment.hours,
      Services: establishment.services?.join(', '),
      Latitude: establishment.coordinates?.lat,
      Longitude: establishment.coordinates?.lng,
      Verified: false, // Nouvelles suggestions non vérifiées
      Premium: false
    });

    console.log('✅ Établissement ajouté à Airtable:', record.id);
    return record.id;
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout à Airtable:', error);
    return null;
  }
};