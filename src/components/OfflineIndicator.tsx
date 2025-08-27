import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  const handleRetry = () => {
    window.location.reload();
  };

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-orange-500 text-white rounded-xl shadow-lg p-4 z-40 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOff className="h-5 w-5" />
          <div>
            <p className="font-medium">Mode hors ligne</p>
            <p className="text-sm opacity-90">Certaines fonctionnalités sont limitées</p>
          </div>
        </div>
        <button
          onClick={handleRetry}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
          title="Réessayer la connexion"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;