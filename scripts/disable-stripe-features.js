#!/usr/bin/env node

/**
 * Script pour désactiver temporairement les fonctionnalités Stripe
 * Usage: node scripts/disable-stripe-features.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Désactivation temporaire des fonctionnalités Stripe...\n');

// Créer une version modifiée de App.tsx sans les abonnements
function modifyAppComponent() {
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf8');
    
    // Commenter l'import et l'utilisation de SubscriptionPlans
    content = content.replace(
      /import SubscriptionPlans from '\.\/components\/SubscriptionPlans';/,
      "// import SubscriptionPlans from './components/SubscriptionPlans'; // Désactivé temporairement"
    );
    
    content = content.replace(
      /<SubscriptionPlans \/>/,
      "{/* <SubscriptionPlans /> */} {/* Désactivé temporairement */}"
    );
    
    fs.writeFileSync(appPath, content);
    console.log('✅ App.tsx modifié - SubscriptionPlans désactivé');
  }
}

// Créer un fichier de configuration pour indiquer que Stripe est désactivé
function createStripeConfig() {
  const configContent = `// Configuration Stripe
export const STRIPE_ENABLED = false;

// Cette variable peut être utilisée pour conditionner l'affichage
// des fonctionnalités de paiement dans l'application
export const PAYMENT_FEATURES_ENABLED = false;

// Message à afficher à la place des plans d'abonnement
export const STRIPE_DISABLED_MESSAGE = "Les fonctionnalités de paiement seront bientôt disponibles !";
`;

  const configPath = path.join(process.cwd(), 'src/config/stripe.ts');
  const configDir = path.dirname(configPath);
  
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Configuration Stripe créée');
}

// Modifier le fichier .env pour commenter Stripe
function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Commenter les variables Stripe
    content = content.replace(
      /^(VITE_STRIPE_PUBLISHABLE_KEY=.*)/gm,
      '# $1 # Désactivé temporairement'
    );
    content = content.replace(
      /^(STRIPE_SECRET_KEY=.*)/gm,
      '# $1 # Désactivé temporairement'
    );
    content = content.replace(
      /^(STRIPE_WEBHOOK_SECRET=.*)/gm,
      '# $1 # Désactivé temporairement'
    );
    
    fs.writeFileSync(envPath, content);
    console.log('✅ Variables Stripe commentées dans .env');
  }
}

// Créer un composant de remplacement pour SubscriptionPlans
function createPlaceholderComponent() {
  const placeholderContent = `import React from 'react';
import { Crown, Clock, CheckCircle } from 'lucide-react';

const SubscriptionPlansPlaceholder: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Crown className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Fonctionnalités Premium
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Les abonnements et fonctionnalités premium seront bientôt disponibles !
              </p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-semibold text-blue-900">Bientôt disponible</span>
                </div>
                
                <ul className="space-y-3 text-left max-w-md mx-auto">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Plans d'abonnement flexibles</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Fonctionnalités premium pour entreprises</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Support prioritaire</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Statistiques avancées</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl">
                <p className="font-medium">
                  En attendant, profitez de toutes les fonctionnalités gratuites !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlansPlaceholder;
`;

  const placeholderPath = path.join(process.cwd(), 'src/components/SubscriptionPlansPlaceholder.tsx');
  fs.writeFileSync(placeholderPath, placeholderContent);
  console.log('✅ Composant de remplacement créé');
}

// Exécution
console.log('🎯 Préparation pour le déploiement sans Stripe...\n');

modifyAppComponent();
createStripeConfig();
updateEnvFile();
createPlaceholderComponent();

console.log('\n✨ Configuration terminée !');
console.log('\n📋 Prochaines étapes :');
console.log('  1. Configurez vos variables Supabase et Google Maps dans .env');
console.log('  2. Testez avec : npm run dev');
console.log('  3. Buildez avec : npm run build');
console.log('  4. Déployez le dossier dist/ sur Netlify');

console.log('\n💡 Pour réactiver Stripe plus tard :');
console.log('  - Décommentez les variables dans .env');
console.log('  - Restaurez SubscriptionPlans dans App.tsx');
console.log('  - Redéployez');