import { SubscriptionPlan } from '../types';

export const subscriptionPlans: SubscriptionPlan[] = [
  // Plans pour entreprises
  {
    id: 'basic-weekly',
    name: 'Basique Hebdomadaire',
    price: 15,
    duration: 'semaine',
    target: 'business',
    features: [
      'Inscription de votre établissement',
      'Informations de base',
      'Photos (jusqu\'à 5)',
      'Horaires d\'ouverture',
      'Contact téléphonique'
    ]
  },
  {
    id: 'basic-monthly',
    name: 'Basique Mensuel',
    price: 49,
    duration: 'mois',
    target: 'business',
    features: [
      'Inscription de votre établissement',
      'Informations de base',
      'Photos (jusqu\'à 5)',
      'Horaires d\'ouverture',
      'Contact téléphonique'
    ]
  },
  {
    id: 'starter-monthly',
    name: 'Starter Mensuel',
    price: 25,
    duration: 'mois',
    target: 'business',
    features: [
      'Inscription de base',
      'Photos (jusqu\'à 5)',
      'Informations essentielles',
      'Contact téléphonique',
      'Horaires d\'ouverture'
    ]
  },
  {
    id: 'artisan-monthly',
    name: 'Artisan Mensuel',
    price: 35,
    duration: 'mois',
    target: 'business',
    features: [
      'Tout du plan Starter',
      'Photos (jusqu\'à 5)',
      'Description détaillée',
      'Services listés',
      'Support par email'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium Mensuel',
    price: 89,
    duration: 'mois',
    popular: true,
    target: 'business',
    features: [
      'Tout du plan Basique',
      'Badge "Vérifié"',
      'Photos illimitées',
      'Description détaillée',
      'Site web et email',
      'Mise en avant dans les résultats',
      'Support prioritaire'
    ]
  },
  {
    id: 'premium-semester',
    name: 'Premium Semestriel',
    price: 449,
    duration: 'semestre',
    target: 'business',
    features: [
      'Tout du plan Premium Mensuel',
      'Statistiques détaillées',
      'Gestion des avis',
      'Promotion sur la page d\'accueil',
      'Support prioritaire',
      'Réduction de 15%'
    ]
  },
  {
    id: 'enterprise-annual',
    name: 'Enterprise Annuel',
    price: 799,
    duration: 'an',
    target: 'business',
    features: [
      'Tout du plan Premium',
      'Statistiques avancées',
      'API d\'intégration',
      'Gestion multi-établissements',
      'Support dédié',
      'Formation personnalisée',
      'Réduction de 25%'
    ]
  },
  
  // Plans pour touristes
  {
    id: 'tourist-daily',
    name: 'Touriste Journalier',
    price: 3,
    duration: 'jour',
    target: 'tourist',
    features: [
      'Accès complet aux établissements',
      'Recherche avancée',
      'Itinéraires personnalisés',
      'Recommandations locales',
      'Support multilingue'
    ]
  },
  {
    id: 'tourist-weekly',
    name: 'Touriste Hebdomadaire',
    price: 15,
    duration: 'semaine',
    popular: true,
    target: 'tourist',
    features: [
      'Tout du plan journalier',
      'Guides touristiques exclusifs',
      'Réductions partenaires',
      'Événements locaux',
      'Assistance 24/7'
    ]
  },
  {
    id: 'tourist-monthly',
    name: 'Touriste Mensuel',
    price: 45,
    duration: 'mois',
    target: 'tourist',
    features: [
      'Tout du plan hebdomadaire',
      'Accès VIP aux événements',
      'Concierge virtuel',
      'Réservations prioritaires',
      'Carte de réductions premium'
    ]
  },
  
  // Plans pour tunisiens (résidents)
  {
    id: 'tunisian-daily',
    name: 'Tunisien Journalier',
    price: 2,
    duration: 'jour',
    target: 'business',
    features: [
      'Accès complet aux établissements',
      'Recherche par quartier',
      'Informations locales',
      'Contact direct',
      'Tarifs préférentiels'
    ]
  },
  {
    id: 'tunisian-weekly',
    name: 'Tunisien Hebdomadaire',
    price: 10,
    duration: 'semaine',
    target: 'business',
    features: [
      'Tout du plan journalier',
      'Alertes nouveaux établissements',
      'Avis et commentaires',
      'Favoris personnalisés',
      'Support en arabe/français'
    ]
  },
  {
    id: 'tunisian-monthly',
    name: 'Tunisien Mensuel',
    price: 25,
    duration: 'mois',
    target: 'business',
    features: [
      'Tout du plan hebdomadaire',
      'Notifications personnalisées',
      'Historique de recherches',
      'Recommandations intelligentes',
      'Support prioritaire'
    ]
  }
];