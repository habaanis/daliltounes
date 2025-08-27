import React from 'react';
import { X, Star, MapPin, Phone, Mail, Globe, Clock, CheckCircle, Crown, Heart, Share2, Bookmark, Navigation, Accessibility } from 'lucide-react';
import { Establishment } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useSubscription } from '../hooks/useSubscription';

interface EstablishmentDetailsProps {
  establishment: Establishment;
  onClose: () => void;
}

const EstablishmentDetails: React.FC<EstablishmentDetailsProps> = ({ establishment, onClose }) => {
  const { t, isRTL } = useLanguage();
  const { canViewContactInfo, canViewServices } = useSubscription();

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: establishment.name,
          text: establishment.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copier l'URL dans le presse-papiers
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  const handleGetDirections = () => {
    const { lat, lng } = establishment.coordinates;
    // Détecter si l'utilisateur est sur mobile pour proposer les bonnes options
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Sur mobile, proposer le choix entre Google Maps et Waze
      showNavigationOptions(lat, lng);
    } else {
      // Sur desktop, ouvrir Google Maps directement
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const showNavigationOptions = (lat: number, lng: number) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]';
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 class="text-lg font-bold text-gray-900 mb-4 text-center">Choisir l'application de navigation</h3>
        <div class="space-y-3">
          <button id="google-maps-btn" class="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Google Maps</div>
              <div class="text-sm text-gray-500">Navigation GPS</div>
            </div>
          </button>
          
          <button id="waze-btn" class="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Waze</div>
              <div class="text-sm text-gray-500">Navigation communautaire</div>
            </div>
          </button>
          
          <button id="apple-maps-btn" class="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div class="text-left">
              <div class="font-medium text-gray-900">Apple Plans</div>
              <div class="text-sm text-gray-500">Navigation iOS</div>
            </div>
          </button>
        </div>
        
        <button id="cancel-btn" class="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
          Annuler
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Gestionnaires d'événements
    const googleMapsBtn = modal.querySelector('#google-maps-btn');
    const wazeBtn = modal.querySelector('#waze-btn');
    const appleMapsBtn = modal.querySelector('#apple-maps-btn');
    const cancelBtn = modal.querySelector('#cancel-btn');
    
    googleMapsBtn?.addEventListener('click', () => {
      openGoogleMaps(lat, lng);
      document.body.removeChild(modal);
    });
    
    wazeBtn?.addEventListener('click', () => {
      openWaze(lat, lng);
      document.body.removeChild(modal);
    });
    
    appleMapsBtn?.addEventListener('click', () => {
      openAppleMaps(lat, lng);
      document.body.removeChild(modal);
    });
    
    cancelBtn?.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  };

  const openGoogleMaps = (lat: number, lng: number) => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Essayer d'ouvrir l'app Google Maps
      const appUrl = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      
      // Créer un lien temporaire pour tester si l'app est installée
      const link = document.createElement('a');
      link.href = appUrl;
      
      // Timeout pour détecter si l'app s'ouvre
      const timeout = setTimeout(() => {
        window.open(webUrl, '_blank');
      }, 1000);
      
      // Si l'app s'ouvre, annuler le timeout
      window.addEventListener('blur', () => {
        clearTimeout(timeout);
      }, { once: true });
      
      link.click();
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const openWaze = (lat: number, lng: number) => {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Essayer d'ouvrir l'app Waze
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

  const openAppleMaps = (lat: number, lng: number) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      const url = `maps://maps.google.com/maps?daddr=${lat},${lng}&amp;ll=`;
      window.location.href = url;
    } else {
      // Fallback vers Google Maps sur non-iOS
      openGoogleMaps(lat, lng);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={establishment.image}
            alt={establishment.name}
            className="w-full h-64 object-cover rounded-t-xl"
            loading="lazy"
            decoding="async"
          />
          <button
            onClick={onClose}
            className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors`}
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[establishment.category]}`}>
              {t(establishment.category)}
            </span>
            {establishment.verified && (
              <div className={`bg-green-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{t('verified')}</span>
              </div>
            )}
            {establishment.premium && (
              <div className={`bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">{t('premium')}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-2xl font-bold text-gray-900">{establishment.name}</h2>
              <p className="text-lg text-gray-600">{establishment.subcategory}</p>
              <p className="text-sm text-gray-500 flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{t(establishment.governorate)}</span></p>
            </div>
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <button 
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                title="Partager"
              >
                <Share2 className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Ajouter aux favoris">
                <Heart className="h-6 w-6" />
              </button>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 mb-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-medium text-gray-700">{establishment.rating}</span>
            </div>
            <span className="text-gray-500">({establishment.reviewCount} {t('reviews')})</span>
          </div>
          
          <p className={`text-gray-600 mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            {establishment.description}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                Informations de contact
              </h3>
              
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{establishment.address}</span>
                </div>
                
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <Phone className="h-5 w-5 text-gray-400" />
                  {canViewContactInfo(establishment.category) ? (
                    <a href={`tel:${establishment.phone}`} className="text-blue-600 hover:underline">
                      {establishment.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Abonnement requis pour voir le téléphone</span>
                  )}
                </div>
                
                {canViewContactInfo(establishment.category) && establishment.email && (
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                    <Mail className="h-5 w-5 text-gray-400" />
                    <a href={`mailto:${establishment.email}`} className="text-blue-600 hover:underline">
                      {establishment.email}
                    </a>
                  </div>
                )}
                
                {canViewContactInfo(establishment.category) && establishment.website && (
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                    <Globe className="h-5 w-5 text-gray-400" />
                    <a href={`https://${establishment.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {establishment.website}
                    </a>
                  </div>
                )}
                
                {!canViewContactInfo(establishment.category) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Crown className="h-5 w-5" />
                      <span className="font-medium">Informations de contact premium</span>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">
                      Souscrivez à un abonnement pour accéder aux coordonnées complètes de cet établissement.
                    </p>
                  </div>
                )}
                
                <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">{establishment.hours}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('services')}
              </h3>
              {canViewServices(establishment.category) ? (
                <div className="flex flex-wrap gap-2">
                  {establishment.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-800">
                    <Crown className="h-5 w-5" />
                    <span className="font-medium">Services détaillés premium</span>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">
                    Souscrivez à un abonnement pour voir la liste complète des services proposés.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex space-x-3">
            {canViewContactInfo(establishment.category) ? (
              <button className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[48px] touch-target">
                <a href={`tel:${establishment.phone}`} className="flex items-center justify-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Appeler</span>
                </a>
              </button>
            ) : (
              <button className="flex-1 bg-gray-400 text-white py-4 px-6 rounded-lg cursor-not-allowed font-medium flex items-center justify-center space-x-2 min-h-[48px]">
                <Crown className="h-5 w-5" />
                <span>Abonnement requis</span>
              </button>
            )}
            <button 
              onClick={handleGetDirections}
              className="flex-1 border border-gray-300 text-gray-700 py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2 min-h-[48px] touch-target"
            >
              <Navigation className="h-5 w-5" />
              <span>Itinéraire</span>
            </button>
          </div>
          
          {/* Informations d'accessibilité */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className={`flex items-center space-x-2 mb-2 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Accessibility className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Accessibilité</h4>
            </div>
            <p className="text-sm text-blue-800">
              {canViewServices(establishment.category) && establishment.services.some(service => service.toLowerCase().includes('accessibilité') || service.toLowerCase().includes('pmr'))
                ? 'Établissement accessible aux personnes à mobilité réduite'
                : 'Informations d\'accessibilité non disponibles. Contactez l\'établissement pour plus de détails.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDetails;