import React from 'react';
import { Navigation, MapPin, Route } from 'lucide-react';
import { Establishment } from '../types';

interface NavigationButtonsProps {
  establishment: Establishment;
  variant?: 'full' | 'compact';
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  establishment, 
  variant = 'full',
  className = '' 
}) => {
  const { lat, lng } = establishment.coordinates;

  const openGoogleMaps = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const appUrl = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      
      const link = document.createElement('a');
      link.href = appUrl;
      
      const timeout = setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 1000);
      
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
      }, { once: true });
      
      link.click();
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const openWaze = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const appUrl = `waze://?ll=${lat},${lng}&navigate=yes`;
      const webUrl = `https://www.waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`;
      
      const link = document.createElement('a');
      link.href = appUrl;
      
      const timeout = setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 1000);
      
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
      }, { once: true });
      
      link.click();
    } else {
      const url = `https://www.waze.com/ul?ll=${lat}%2C${lng}&navigate=yes`;
      window.open(url, '_blank');
    }
  };

  const openAppleMaps = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const url = `maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
      window.location.href = url;
    } else {
      openGoogleMaps();
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        <button
          onClick={openGoogleMaps}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          title="Google Maps"
        >
          <Navigation className="h-4 w-4" />
          <span>Maps</span>
        </button>
        
        <button
          onClick={openWaze}
          className="flex items-center space-x-1 px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors text-sm"
          title="Waze"
        >
          <Route className="h-4 w-4" />
          <span>Waze</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${className}`}>
      <button
        onClick={openGoogleMaps}
        className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <Navigation className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">Google Maps</div>
          <div className="text-sm text-gray-500">Navigation GPS</div>
        </div>
      </button>
      
      <button
        onClick={openWaze}
        className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
          <Route className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">Waze</div>
          <div className="text-sm text-gray-500">Navigation communautaire</div>
        </div>
      </button>
      
      <button
        onClick={openAppleMaps}
        className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
      >
        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-900 transition-colors">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">Apple Plans</div>
          <div className="text-sm text-gray-500">Navigation iOS</div>
        </div>
      </button>
    </div>
  );
};

export default NavigationButtons;