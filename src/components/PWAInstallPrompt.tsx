import React, { useState } from 'react';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '../hooks/useLanguage';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isOnline, updateAvailable, installApp, updateApp } = usePWA();
  const { t, isRTL } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    setIsInstalling(false);
    
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleUpdate = () => {
    updateApp();
  };

  // Afficher la bannière de mise à jour
  if (updateAvailable) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-4 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Download className="h-5 w-5" />
            <span className="font-medium">Une nouvelle version est disponible</span>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Mettre à jour
          </button>
        </div>
      </div>
    );
  }

  // Afficher l'indicateur de statut hors ligne
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white p-3 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-center space-x-2">
          <WifiOff className="h-5 w-5" />
          <span className="font-medium">Mode hors ligne - Fonctionnalités limitées</span>
        </div>
      </div>
    );
  }

  // Ne pas afficher si déjà installé ou non installable
  if (isInstalled || !isInstallable || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50 animate-slide-up">
      <button
        onClick={() => setShowPrompt(false)}
        className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600 transition-colors`}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-4">
        <div className={`flex items-center space-x-3 mb-3 ${isRTL ? 'space-x-reverse' : ''}`}>
          <div className="bg-blue-100 p-2 rounded-lg">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Installer daliltounes</h3>
            <p className="text-sm text-gray-600">Guide des établissements</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Installez notre application pour une expérience optimale avec :
        </p>

        <ul className="text-sm text-gray-600 space-y-2 mb-4">
          <li className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Accès rapide depuis votre écran d'accueil</span>
          </li>
          <li className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Fonctionnement hors ligne</span>
          </li>
          <li className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Notifications push</span>
          </li>
          <li className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Interface native</span>
          </li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setShowPrompt(false)}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Plus tard
        </button>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 ${
            isInstalling ? 'opacity-50 cursor-not-allowed' : ''
          } ${isRTL ? 'space-x-reverse' : ''}`}
        >
          <Download className="h-4 w-4" />
          <span>{isInstalling ? 'Installation...' : 'Installer'}</span>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;