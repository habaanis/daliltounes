import { EstablishmentCategory } from '../types';

export const subcategoriesByCategory: Record<EstablishmentCategory, string[]> = {
  hotel: [
    'Hôtel 5 étoiles',
    'Hôtel 4 étoiles',
    'Hôtel 3 étoiles',
    'Hôtel boutique',
    'Resort',
    'Auberge de jeunesse',
    'Maison d\'hôtes',
    'Riad traditionnel'
  ],
  
  cultural: [
    'Musée',
    'Théâtre',
    'Galerie d\'art',
    'Centre culturel',
    'Monument historique',
    'Site archéologique',
    'Bibliothèque',
    'Artisanat traditionnel'
  ],
  
  administrative: [
    'Mairie',
    'Préfecture',
    'Consulat',
    'Ambassade',
    'Bureau de poste',
    'Centre des impôts',
    'Sécurité sociale',
    'État civil'
  ],
  
  sport: [
    'Salle de sport',
    'Piscine',
    'Terrain de football',
    'Club de tennis',
    'Centre de fitness',
    'Spa & Wellness',
    'Club nautique',
    'Centre équestre'
  ],
  
  animal: [
    'Vétérinaire',
    'Animalerie',
    'Zoo',
    'Refuge pour animaux',
    'Toilettage',
    'Dressage',
    'Ferme pédagogique',
    'Clinique vétérinaire'
  ],
  
  construction: [
    'Entreprise de construction',
    'Architecte',
    'Ingénieur',
    'Matériaux de construction',
    'Plomberie',
    'Électricité',
    'Peinture',
    'Carrelage'
  ],
  
  alimentation: [
    'Restaurant traditionnel',
    'Restaurant français',
    'Restaurant italien',
    'Restaurant de poissons',
    'Fast food',
    'Café',
    'Pâtisserie',
    'Boulangerie',
    'Supermarché',
    'Épicerie',
    'Marché'
  ],
  
  sante: [
    'Hôpital public',
    'Clinique privée',
    'Médecin généraliste',
    'Médecin spécialiste',
    'Dentiste',
    'Pharmacie',
    'Laboratoire',
    'Centre d\'imagerie',
    'Kinésithérapeute',
    'Psychologue',
    'Ophtalmologue',
    'Cardiologue',
    'Dermatologue',
    'Gynécologue',
    'Pédiatre'
  ],
  
  justice: [
    'Tribunal de première instance',
    'Tribunal d\'appel',
    'Cour de cassation',
    'Tribunal administratif',
    'Cabinet d\'avocat',
    'Étude notariale',
    'Huissier de justice',
    'Centre de médiation',
    'Conseil juridique',
    'Expert judiciaire'
  ],
  
  ecole: [
    'École primaire publique',
    'École primaire privée',
    'Collège public',
    'Collège privé',
    'Lycée public',
    'Lycée privé',
    'École internationale',
    'Institut supérieur privé',
    'Université publique',
    'Formation professionnelle',
    'École de langues',
    'École d\'art',
    'École de musique',
    'Crèche',
    'Jardin d\'enfants'
  ],
  
  taxi: [
    'Station de taxi',
    'Taxi individuel',
    'Taxi de luxe',
    'Coopérative de taxi',
    'Navette aéroport',
    'Taxi spécialisé',
    'Louage',
    'Transport scolaire',
    'Ambulance',
    'Transport médical'
  ],
  
  tourism: [
    'Agence de voyage',
    'Guide touristique',
    'Site touristique',
    'Parc d\'attractions',
    'Plage',
    'Port de plaisance',
    'Centre de loisirs',
    'Excursions',
    'Location de voitures',
    'Office de tourisme'
  ],
  
  divers: [
    'Coiffeur',
    'Salon de beauté',
    'Pressing',
    'Cordonnerie',
    'Bijouterie',
    'Horlogerie',
    'Photographe',
    'Imprimerie',
    'Librairie',
    'Fleuriste',
    'Décoration',
    'Électroménager',
    'Informatique',
    'Téléphonie',
    'Banque',
    'Assurance',
    'Immobilier',
    'Location de voitures',
    'Garage automobile',
    'Station-service',
    'Lavage auto',
    'Pièces détachées',
    'Menuiserie',
    'Serrurerie',
    'Climatisation',
    'Nettoyage',
    'Sécurité',
    'Déménagement',
    'Coursier',
    'Traduction',
    'Formation',
    'Consulting',
    'Comptabilité',
    'Marketing',
    'Événementiel',
    'Traiteur',
    'Location matériel',
    'Réparation',
    'Autre service'
  ]
};