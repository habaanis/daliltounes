#!/usr/bin/env node

/**
 * Script d'aide pour configurer les variables d'environnement de production
 * Usage: node scripts/setup-production-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupProductionEnv() {
  console.log('🔧 Configuration des variables d\'environnement de production\n');
  
  console.log('📝 Nous allons créer votre fichier .env de production');
  console.log('⚠️  Gardez ces informations secrètes et sécurisées!\n');

  const envVars = {};

  // Stripe
  console.log('💳 Configuration Stripe :');
  envVars.VITE_STRIPE_PUBLISHABLE_KEY = await question('Clé publique Stripe (pk_live_...) : ');
  envVars.STRIPE_SECRET_KEY = await question('Clé secrète Stripe (sk_live_...) : ');
  envVars.STRIPE_WEBHOOK_SECRET = await question('Secret webhook Stripe (whsec_...) : ');

  // Supabase
  console.log('\n🗄️  Configuration Supabase :');
  envVars.VITE_SUPABASE_URL = await question('URL Supabase (https://xxx.supabase.co) : ');
  envVars.VITE_SUPABASE_ANON_KEY = await question('Clé anonyme Supabase : ');
  envVars.SUPABASE_SERVICE_ROLE_KEY = await question('Clé service role Supabase : ');

  // Google Maps
  console.log('\n🗺️  Configuration Google Maps :');
  envVars.GOOGLE_MAPS_API_KEY = await question('Clé API Google Maps : ');

  // Créer le fichier .env
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const envPath = path.join(process.cwd(), '.env');
  
  // Backup de l'ancien fichier s'il existe
  if (fs.existsSync(envPath)) {
    const backupPath = `${envPath}.backup.${Date.now()}`;
    fs.copyFileSync(envPath, backupPath);
    console.log(`\n📋 Ancien .env sauvegardé dans ${backupPath}`);
  }

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Fichier .env créé avec succès!');
  
  console.log('\n🔒 Sécurité :');
  console.log('  - Ne commitez JAMAIS ce fichier .env');
  console.log('  - Gardez une copie sécurisée de ces clés');
  console.log('  - Configurez les restrictions sur vos clés API');

  console.log('\n🎯 Prochaines étapes :');
  console.log('  1. Testez votre configuration avec : npm run dev');
  console.log('  2. Vérifiez que les paiements fonctionnent');
  console.log('  3. Lancez le build : npm run build');
  console.log('  4. Déployez sur Netlify');

  rl.close();
}

setupProductionEnv().catch(console.error);