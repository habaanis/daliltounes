import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Layers, Maximize2, Minimize2, Globe } from 'lucide-react';
import { Establishment } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { config } from '../config/environment';

interface MapViewProps {
  establishments: Establishment[];
  selectedEstablishment?: Establishment | null;
  onEstablishmentSelect?: (establishment: Establishment) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({
  establishments,
  selectedEstablishment,
  onEstablishmentSelect,
  center = { lat: 36.8065, lng: 10.1815 }, // Centre de la Tunisie
  zoom = 7
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>('Google Maps temporairement désactivé - Utilisation d\'alternatives de navigation');
   
  const [showEstablishmentsList, setShowEstablishmentsList] = useState(false);
  const { isRTL } = useLanguage();
  
  // Vérifier si Google Maps est configuré
  const isGoogleMapsConfigured = config.googleMaps.apiKey && config.googleMaps.apiKey.length > 10;

  useEffect(() => {
    // Demander la géolocalisation de l'utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Géolocalisation non disponible:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Vérifier la configuration Google Maps
    if (!isGoogleMapsConfigured) {
      setMapError('Google Maps non configuré - Affichage de la liste des établissements');
    } else {
      setMapError(null);
      // Ici vous pourriez initialiser Google Maps avec les établissements
      initializeGoogleMaps();
    }

  }, [establishments, selectedEstablishment, center, zoom, mapType, userLocation, onEstablishmentSelect]);

  const initializeGoogleMaps = async () => {
    if (!isGoogleMapsConfigured) return;
    
    try {
      // Charger Google Maps
      const { Loader } = await import('@googlemaps/js-api-loader');
      
      const loader = new Loader({
        apiKey: config.googleMaps.apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      const google = await loader.load();
      
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          mapTypeId: mapType,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Ajouter les marqueurs pour tous les établissements
        establishments.forEach((establishment) => {
          const marker = new google.maps.Marker({
            position: establishment.coordinates,
            map: map,
            title: establishment.name,
            icon: {
              url: getMarkerIcon(establishment.category, establishment.premium),
              scaledSize: new google.maps.Size(32, 32)
            }
          });

          // InfoWindow pour chaque marqueur
          const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(establishment)
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            if (onEstablishmentSelect) {
              onEstablishmentSelect(establishment);
            }
          });
        });

        // Ajuster la vue pour inclure tous les marqueurs
        if (establishments.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          establishments.forEach(est => {
            bounds.extend(est.coordinates);
          });
          map.fitBounds(bounds);
        }

        setMapError(null);
        console.log(`✅ Carte Google Maps initialisée avec ${establishments.length} établissements`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de Google Maps:', error);
      setMapError('Erreur lors du chargement de Google Maps');
    }
  };

  const getMarkerIcon = (category: string, premium: boolean) => {
    const color = premium ? '#FFD700' : getCategoryColor(category);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C11.6 2 8 5.6 8 10C8 17 16 30 16 30S24 17 24 10C24 5.6 20.4 2 16 2Z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="16" cy="10" r="4" fill="#ffffff"/>
      </svg>
    `)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      hotel: '#8B5CF6',
      cultural: '#EC4899',
      administrative: '#3B82F6',
      sport: '#10B981',
      animal: '#F59E0B',
      construction: '#6B7280',
      alimentation: '#6366F1',
      sante: '#EF4444',
      justice: '#D97706',
      ecole: '#059669',
      taxi: '#EA580C',
      tourism: '#14B8A6'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const createInfoWindowContent = (establishment: Establishment) => {
    return `
      <div class="p-3 max-w-xs">
        <h3 class="font-bold text-lg text-gray-900 mb-1">${establishment.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${establishment.subcategory}</p>
        <p class="text-xs text-gray-500 mb-2">${establishment.address}</p>
        <p class="text-sm text-gray-700 mb-3 line-clamp-2">${establishment.description}</p>
        <div class="flex items-center space-x-2 mb-2">
          <span class="text-yellow-500">★</span>
          <span class="text-sm font-medium">${establishment.rating}</span>
          <span class="text-sm text-gray-500">(${establishment.reviewCount} avis)</span>
        </div>
        <div class="flex space-x-2">
          <button onclick="window.open('tel:${establishment.phone}')" class="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors">
            Appeler
          </button>
          <button onclick="openNavigation(${establishment.coordinates.lat}, ${establishment.coordinates.lng})" class="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors">
            Y aller
          </button>
        </div>
      </div>
    `;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleNavigationToAll = () => {
    if (userLocation && establishments.length > 0) {
      // Ouvrir Google Maps web avec les établissements
      const firstEstablishment = establishments[0];
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${firstEstablishment.coordinates.lat},${firstEstablishment.coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  // Ajouter la fonction globale pour la navigation
  useEffect(() => {
    (window as any).openNavigation = (lat: number, lng: number) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    };
  }, []);

  return (
    <div className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'h-96'}`}>
      {/* Message d'erreur */}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
          <div className="text-center max-w-md mx-auto p-6">
            <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vue carte alternative</h3>
            <p className="text-gray-600 mb-4">{mapError}</p>
            
            {/* Liste des établissements avec navigation directe */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Établissements ({establishments.length})
                </h4>
                <button
                  onClick={() => setShowEstablishmentsList(!showEstablishmentsList)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showEstablishmentsList ? 'Masquer' : 'Voir tous'}
                </button>
              </div>
              
              {establishments.slice(0, 5).map((establishment) => (
                <div key={establishment.id} className="bg-white p-3 rounded-lg shadow border text-left">
                  <h4 className="font-semibold text-gray-900 text-sm">{establishment.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{establishment.address}</p>
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-gray-600">{establishment.rating}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {establishment.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${establishment.coordinates.lat},${establishment.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                      className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Navigation
                    </button>
                    <button
                      onClick={() => onEstablishmentSelect && onEstablishmentSelect(establishment)}
                      className="flex-1 bg-gray-600 text-white text-xs py-1 px-2 rounded hover:bg-gray-700 transition-colors"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              ))}
              {establishments.length > 5 && (
                <p className="text-sm text-gray-500">
                  +{establishments.length - 5} autres établissements
                  <button
                    onClick={() => setShowEstablishmentsList(true)}
                    className="text-blue-600 hover:text-blue-700 ml-2"
                  >
                    Voir tous
                  </button>
                </p>
              )}
              
              {/* Liste complète des établissements */}
              {showEstablishmentsList && (
                <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
                  {establishments.map((establishment) => (
                    <div key={establishment.id} className="bg-white p-3 rounded-lg shadow border text-left">
                      <h4 className="font-semibold text-gray-900 text-sm">{establishment.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{establishment.subcategory}</p>
                      <p className="text-xs text-gray-500 mb-2">{establishment.address}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${establishment.coordinates.lat},${establishment.coordinates.lng}`;
                            window.open(url, '_blank');
                          }}
                          className="flex-1 bg-blue-600 text-white text-xs py-1 px-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Navigation
                        </button>
                        <button
                          onClick={() => onEstablishmentSelect && onEstablishmentSelect(establishment)}
                          className="flex-1 bg-gray-600 text-white text-xs py-1 px-2 rounded hover:bg-gray-700 transition-colors"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contrôles de la carte */}
      {!mapError && (
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10 flex flex-col space-y-2`}>
          <button
            onClick={toggleFullscreen}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
            className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            title="Changer le type de carte"
          >
            <Layers className="h-5 w-5" />
          </button>
          
          {userLocation && establishments.length > 0 && (
            <button
              onClick={handleNavigationToAll}
              className="bg-green-600 text-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              title="Itinéraire vers tous les établissements"
            >
              <Navigation className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Carte */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapView;