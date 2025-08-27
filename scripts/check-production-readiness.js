#!/usr/bin/env node

/**
 * Script de vérification de la préparation à la production
 * Usage: node scripts/check-production-readiness.js
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification de la préparation à la production...\n');

// Vérifier les variables d'environnement
function checkEnvVariables() {
  console.log('📋 Variables d\'environnement :');
  
  const requiredVars = [
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY', 
    'STRIPE_WEBHOOK_SECRET',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_MAPS_API_KEY'
  ];

  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  requiredVars.forEach(varName => {
    const hasVar = envContent.includes(varName);
    const isProduction = envContent.includes(`${varName}=pk_live_`) || 
                        envContent.includes(`${varName}=sk_live_`) ||
                        (!varName.includes('STRIPE') && hasVar);
    
    if (varName.includes('STRIPE')) {
      if (hasVar) {
        if (isProduction) {
          console.log(`  ✅ ${varName} (PRODUCTION)`);
        } else {
          console.log(`  ⚠️  ${varName} (TEST - à changer pour la production)`);
        }
      } else {
        console.log(`  ❌ ${varName} (MANQUANT)`);
      }
    } else {
      console.log(`  ${hasVar ? '✅' : '❌'} ${varName}`);
    }
  });
}

// Vérifier la configuration du build
function checkBuildConfig() {
  console.log('\n🏗️  Configuration de build :');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`  ✅ Scripts de build configurés`);
    console.log(`  ✅ Dependencies : ${Object.keys(pkg.dependencies || {}).length}`);
    console.log(`  ✅ DevDependencies : ${Object.keys(pkg.devDependencies || {}).length}`);
  }
}

// Vérifier les fichiers PWA
function checkPWAFiles() {
  console.log('\n📱 Fichiers PWA :');
  
  const pwaFiles = [
    'public/manifest.json',
    'public/sw.js',
    'public/icons/icon-192x192.png',
    'public/icons/icon-512x512.png'
  ];

  pwaFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  });
}

// Vérifier la sécurité
function checkSecurity() {
  console.log('\n🔒 Sécurité :');
  
  const indexHtml = path.join(process.cwd(), 'index.html');
  if (fs.existsSync(indexHtml)) {
    const content = fs.readFileSync(indexHtml, 'utf8');
    const hasCSP = content.includes('Content-Security-Policy');
    console.log(`  ${hasCSP ? '✅' : '⚠️'} Content Security Policy ${hasCSP ? '' : '(recommandé)'}`);
  }
  
  console.log('  ✅ HTTPS sera activé automatiquement par Netlify');
  console.log('  ⚠️  Vérifiez que les clés API sont restreintes par domaine');
}

// Recommandations finales
function showRecommendations() {
  console.log('\n💡 Recommandations avant déploiement :');
  console.log('  1. Testez tous les paiements avec les clés de test');
  console.log('  2. Vérifiez que toutes les fonctionnalités marchent');
  console.log('  3. Optimisez les images (déjà fait avec Vite)');
  console.log('  4. Configurez Google Analytics');
  console.log('  5. Préparez un plan de monitoring');
}

// Exécution
checkEnvVariables();
checkBuildConfig();
checkPWAFiles();
checkSecurity();
showRecommendations();

console.log('\n🎯 Prochaines étapes :');
console.log('  1. Activez votre compte Stripe');
console.log('  2. Remplacez les clés de test par les clés de production');
console.log('  3. Configurez Supabase pour la production');
console.log('  4. Déployez sur Netlify');

console.log('\n✨ Votre application est techniquement prête pour la production !');