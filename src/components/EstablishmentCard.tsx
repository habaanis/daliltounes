import React from 'react';
import { Star, MapPin, Phone, Clock, CheckCircle, Crown, Heart, Accessibility, Wifi, Car, Navigation } from 'lucide-react';
import { Establishment } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useSubscription } from '../hooks/useSubscription';

interface EstablishmentCardProps {
  establishment: Establishment;
  onSelect: (establishment: Establishment) => void;
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({ establishment, onSelect }) => {
  const { t, isRTL } = useLanguage();
  const { canViewContactInfo, canViewServices } = useSubscription();

  const handleQuickNavigation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher l'ouverture des détails
    const { lat, lng } = establishment.coordinates;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, ouvrir directement Google Maps
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

  const categoryColors = {
    hotel: 'bg-purple-100 text-purple-800',
    cultural: 'bg-pink-100 text-pink-800',
    administrative: 'bg-blue-100 text-blue-800',
    sport: 'bg-green-100 text-green-800',
    animal: 'bg-yellow-100 text-yellow-800',
    construction: 'bg-gray-100 text-gray-800',
    alimentation: 'bg-indigo-100 text-indigo-800',
    sante: 'bg-red-100 text-red-800',
    justice: 'bg-amber-100 text-amber-800',
    ecole: 'bg-emerald-100 text-emerald-800',
    taxi: 'bg-orange-100 text-orange-800',
    tourism: 'bg-teal-100 text-teal-800',
    divers: 'bg-slate-100 text-slate-800'
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-100 group touch-manipulation"
         onClick={() => onSelect(establishment)}>
      <div className="relative">
        <img
          src={establishment.image}
          alt={establishment.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryColors[establishment.category]} shadow-lg`}>
            {t(establishment.category)}
          </span>
          {establishment.verified && (
            <div className={`bg-green-500 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 backdrop-blur-sm shadow-lg ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{t('verified')}</span>
            </div>
          )}
          {establishment.premium && (
            <div className={`bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full flex items-center space-x-1 backdrop-blur-sm shadow-lg ${isRTL ? 'space-x-reverse' : ''}`}>
              <Crown className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">{t('premium')}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-7">
        <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{establishment.name}</h3>
            <p className="text-sm text-gray-600 font-medium">{establishment.subcategory}</p>
          </div>
          <div className={`flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full ${isRTL ? 'space-x-reverse' : ''}`}>
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-bold text-gray-800">{establishment.rating}</span>
            <span className="text-xs text-gray-600">({establishment.reviewCount})</span>
          </div>
        </div>
        
        <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {establishment.description}
        </p>
        
        <div className="space-y-2">
          <div className={`flex items-center space-x-2 text-sm text-gray-600 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <MapPin className="h-4 w-4 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1" title={establishment.address}>{establishment.address}</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm text-gray-600 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{t(establishment.governorate)}</span>
          </div>
          
          <div className={`flex items-center space-x-2 text-sm ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <Phone className="h-4 w-4 flex-shrink-0 text-green-500" />
            {canViewContactInfo(establishment.category) ? (
              <a 
                href={`tel:${establishment.phone}`} 
                className="hover:text-blue-600 transition-colors text-blue-600 font-medium min-h-[44px] flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {establishment.phone}
              </a>
            ) : (
              <span className="text-gray-400 italic">Abonnement requis</span>
            )}
          </div>
          
          <div className={`flex items-center space-x-2 text-sm text-gray-600 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <Clock className="h-4 w-4 flex-shrink-0 text-orange-500" />
            <span>{establishment.hours}</span>
          </div>
        </div>
        
        {/* Icônes d'accessibilité et services */}
        <div className={`flex items-center space-x-3 mt-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
          <button
            onClick={handleQuickNavigation}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50 min-h-[44px] min-w-[44px] justify-center"
            title="Navigation rapide"
          >
            <Navigation className="h-4 w-4" />
          </button>
          {canViewServices(establishment.category) && establishment.services.some(service => service.toLowerCase().includes('wifi')) && (
            <div className="flex items-center space-x-1 text-blue-500" title="WiFi disponible">
              <Wifi className="h-4 w-4" />
            </div>
          )}
          {canViewServices(establishment.category) && establishment.services.some(service => service.toLowerCase().includes('parking')) && (
            <div className="flex items-center space-x-1 text-green-500" title="Parking disponible">
              <Car className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <div className="mt-5 flex flex-wrap gap-2">
          {canViewServices(establishment.category) ? (
            <>
              {establishment.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium hover:from-blue-100 hover:to-blue-200 transition-colors"
                >
                  {service}
                </span>
              ))}
              {establishment.services.length > 3 && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-xs rounded-full font-medium">
                  +{establishment.services.length - 3} autres
                </span>
              )}
            </>
          ) : (
            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 text-xs rounded-full font-medium">
              🔒 Services disponibles avec abonnement
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstablishmentCard;