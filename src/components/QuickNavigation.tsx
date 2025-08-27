import React, { useState } from 'react';
import { Navigation, MapPin, Route, X } from 'lucide-react';

interface QuickNavigationProps {
  latitude: number;
  longitude: number;
  establishmentName: string;
  onClose?: () => void;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({
  latitude,
  longitude,
  establishmentName,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const openGoogleMaps = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const appUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      
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
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
    handleClose();
  };

  const openWaze = () => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const appUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
      const webUrl = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
      
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
      const url = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
      window.open(url, '_blank');
    }
    handleClose();
  };

  const openAppleMaps = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const url = `maps://maps.google.com/maps?daddr=${latitude},${longitude}&amp;ll=`;
      window.location.href = url;
    } else {
      openGoogleMaps();
    }
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-sm">Navigation vers</h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 truncate">{establishmentName}</p>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={openGoogleMaps}
          className="flex flex-col items-center space-y-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Google Maps</span>
        </button>
        
        <button
          onClick={openWaze}
          className="flex flex-col items-center space-y-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
            <Route className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Waze</span>
        </button>
        
        <button
          onClick={openAppleMaps}
          className="flex flex-col items-center space-y-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs font-medium text-gray-700">Apple Plans</span>
        </button>
      </div>
    </div>
  );
};

export default QuickNavigation;