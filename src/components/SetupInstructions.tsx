import React, { useState } from 'react';
import { Settings, CheckCircle, ExternalLink, Copy, Eye, EyeOff, X } from 'lucide-react'; // Ajout de X

interface SetupInstructionsProps {
  onClose: () => void;
}

const SetupInstructions: React.FC<SetupInstructionsProps> = ({ onClose }) => {
  const [showSecrets, setShowSecrets] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const steps = [
    {
      title: "1. Configuration Stripe",
      items: [
        {
          text: "Créer un compte Stripe",
          link: "https://dashboard.stripe.com/register",
          status: "pending"
        },
        {
          text: "Récupérer les clés API (Développeurs > Clés API)",
          link: "https://dashboard.stripe.com/apikeys",
          status: "pending"
        },
        {
          text: "Configurer les webhooks",
          link: "https://dashboard.stripe.com/webhooks",
          status: "pending"
        }
      ]
    },
    {
      title: "2. Configuration Supabase",
      items: [
        {
          text: "Créer un projet Supabase",
          link: "https://supabase.com/dashboard",
          status: "pending"
        },
        {
          text: "Récupérer les clés API (Settings > API)",
          status: "pending"
        },
        {
          text: "Exécuter les migrations SQL",
          status: "pending"
        }
      ]
    },
    {
      title: "3. Configuration Google Maps",
      items: [
        {
          text: "Créer un projet Google Cloud",
          link: "https://console.cloud.google.com/",
          status: "pending"
        },
        {
          text: "Activer l'API Maps JavaScript",
          link: "https://console.cloud.google.com/apis/library/maps-backend.googleapis.com",
          status: "pending"
        },
        {
          text: "Activer l'API Places",
          link: "https://console.cloud.google.com/apis/library/places-backend.googleapis.com",
          status: "pending"
        },
        {
          text: "Créer une clé API",
          link: "https://console.cloud.google.com/apis/credentials",
          status: "pending"
        }
      ]
    }
  ];

  const envVariables = [
    {
      key: "VITE_STRIPE_PUBLISHABLE_KEY",
      value: "pk_test_...",
      description: "Clé publique Stripe (commence par pk_test_)"
    },
    {
      key: "STRIPE_SECRET_KEY",
      value: "sk_test_...",
      description: "Clé secrète Stripe (commence par sk_test_)",
      secret: true
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      value: "whsec_...",
      description: "Secret webhook Stripe (commence par whsec_)",
      secret: true
    },
    {
      key: "VITE_SUPABASE_URL",
      value: "https://xxx.supabase.co",
      description: "URL de votre projet Supabase"
    },
    {
      key: "VITE_SUPABASE_ANON_KEY",
      value: "",
      description: "Clé anonyme Supabase"
    },
    {
      key: "SUPABASE_SERVICE_ROLE_KEY",
      value: "",
      description: "Clé service role Supabase",
      secret: true
    },
    {
      key: "VITE_GOOGLE_MAPS_API_KEY",
      value: "",
      description: "Clé API Google Maps pour les cartes et géolocalisation (configurée)"
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer les instructions"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Settings className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Configuration Stripe + Supabase</h1>
            </div>
            <p className="text-gray-600">
              Suivez ces étapes pour configurer complètement votre système de paiement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <div className="space-y-3">
                  {step.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-gray-300" />
                      <span className="flex-1 text-gray-700">{item.text}</span>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Variables d'environnement</h3>
              <button
                onClick={() => setShowSecrets(!showSecrets)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showSecrets ? 'Masquer' : 'Afficher'} les secrets</span>
              </button>
            </div>

            <div className="space-y-4">
              {envVariables.map((variable, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-blue-600">{variable.key}</code>
                    <button
                      onClick={() => copyToClipboard(`${variable.key}=${variable.value}`, variable.key)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedField === variable.key && (
                        <span className="text-green-600 text-sm">Copié!</span>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{variable.description}</p>
                  <div className="bg-white rounded p-2">
                    <code className="text-sm text-gray-800">
                      {variable.secret && !showSecrets ? '••••••••••••••••' : variable.value}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Créez un fichier <code>.env</code> à la racine de votre projet 
                et ajoutez-y ces variables avec vos vraies valeurs.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cartes de test Stripe</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-600 mb-2">Paiement réussi</h4>
                <code className="text-sm">4242 4242 4242 4242</code>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-600 mb-2">Paiement échoué</h4>
                <code className="text-sm">4000 0000 0000 0002</code>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-600 mb-2">3D Secure</h4>
                <code className="text-sm">4000 0025 0000 3155</code>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Date d'expiration : n'importe quelle date future (ex: 12/25)<br />
              CVV : n'importe quel code à 3 chiffres (ex: 123)
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Liens utiles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="https://stripe.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <span>Documentation Stripe</span>
              </a>
              <a
                href="https://supabase.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="h-5 w-5 text-green-600" />
                <span>Documentation Supabase</span>
              </a>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <span>Dashboard Stripe</span>
              </a>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="h-5 w-5 text-green-600" />
                <span>Dashboard Supabase</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupInstructions;