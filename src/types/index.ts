export interface Establishment {
  id: string;
  name: string;
  category: EstablishmentCategory;
  subcategory: string;
  description: string;
  address: string;
  governorate: Governorate;
  phone: string;
  email?: string;
  website?: string;
  image: string;
  rating: number;
  reviewCount: number;
  hours: string;
  services: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  verified: boolean;
  premium: boolean;
  pending?: boolean; // Pour les suggestions en attente
}

export type EstablishmentCategory = 
  | 'hotel' 
  | 'cultural' 
  | 'administrative' 
  | 'sport'
  | 'animal'
  | 'construction'
  | 'alimentation'
  | 'sante'
  | 'justice'
  | 'ecole'
  | 'taxi'
  | 'tourism'
  | 'divers';

export type Governorate = 
  | 'tunis' 
  | 'ariana' 
  | 'ben-arous' 
  | 'manouba'
  | 'nabeul' 
  | 'zaghouan' 
  | 'bizerte'
  | 'beja' 
  | 'jendouba' 
  | 'kef' 
  | 'siliana'
  | 'sousse' 
  | 'monastir' 
  | 'mahdia' 
  | 'sfax'
  | 'kairouan' 
  | 'kasserine' 
  | 'sidi-bouzid'
  | 'gabes' 
  | 'medenine' 
  | 'tataouine'
  | 'gafsa' 
  | 'tozeur' 
  | 'kebili';

export type TunisDistrict = 
  | 'medina'
  | 'bab-bhar'
  | 'bab-souika'
  | 'halfaouine'
  | 'omrane'
  | 'omrane-superieur'
  | 'cite-olympique'
  | 'el-menzah'
  | 'ariana-ville'
  | 'ennasr'
  | 'manar'
  | 'centre-ville'
  | 'lafayette'
  | 'passage'
  | 'belvédère'
  | 'mutuelleville'
  | 'montplaisir'
  | 'monfleury'
  | 'notre-dame'
  | 'bardo'
  | 'zahrouni'
  | 'kabaria'
  | 'mellassine'
  | 'hrairia'
  | 'sidi-hassine'
  | 'intilaka'
  | 'khadra'
  | 'sijoumi';

export type Language = 'fr' | 'ar' | 'en' | 'ru' | 'es' | 'it';

export interface SearchFilters {
  category?: EstablishmentCategory;
  subcategory?: string;
  governorate?: Governorate;
  district?: TunisDistrict;
  location?: string;
  rating?: number;
  verified?: boolean;
  premium?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  duration: string;
  popular?: boolean;
  target?: 'business' | 'tourist';
}

export interface Translation {
  [key: string]: {
    fr: string;
    ar: string;
    en: string;
    ru: string;
    es: string;
    it: string;
  };
}

export interface EstablishmentSuggestion {
  id: string;
  name: string;
  category: EstablishmentCategory;
  subcategory: string;
  description: string;
  address: string;
  governorate: Governorate;
  district?: TunisDistrict;
  phone: string;
  email?: string;
  website?: string;
  hours: string;
  services: string[];
  suggestedBy: string; // Email ou nom de la personne qui suggère
  suggestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
}