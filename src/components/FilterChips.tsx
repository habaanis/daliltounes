import React from 'react';
import { X, Star, MapPin, Clock, Wifi, Car, CheckCircle, Crown } from 'lucide-react';
import { FilterOptions } from './AdvancedFilters';
import { useLanguage } from '../hooks/useLanguage';

interface FilterChipsProps {
  filters: FilterOptions;
  onRemoveFilter: (key: keyof FilterOptions) => void;
  onClearAll: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemoveFilter, onClearAll }) => {
  const { t, isRTL } = useLanguage();

  const getFilterIcon = (key: string) => {
    switch (key) {
      case 'verified':
        return CheckCircle;
      case 'premium':
        return Crown;
      case 'openNow':
        return Clock;
      case 'hasParking':
        return Car;
      case 'hasWifi':
        return Wifi;
      case 'minRating':
        return Star;
      case 'governorate':
      case 'distance':
        return MapPin;
      default:
        return null;
    }
  };

  const getFilterLabel = (key: string, value: any) => {
    switch (key) {
      case 'category':
        return t(value);
      case 'governorate':
        return t(value);
      case 'subcategory':
        return value;
      case 'verified':
        return 'Vérifiés';
      case 'premium':
        return 'Premium';
      case 'minRating':
        return `${value}+ étoiles`;
      case 'maxRating':
        return `Max ${value} étoiles`;
      case 'openNow':
        return 'Ouvert maintenant';
      case 'hasParking':
        return 'Parking';
      case 'hasWifi':
        return 'WiFi gratuit';
      case 'acceptsCards':
        return 'Cartes acceptées';
      case 'wheelchairAccessible':
        return 'Accessible PMR';
      case 'familyFriendly':
        return 'Familial';
      case 'priceRange':
        return value === 'budget' ? 'Économique' : value === 'moderate' ? 'Modéré' : 'Haut de gamme';
      case 'distance':
        return `${value}km`;
      case 'sortBy':
        return `Tri: ${value === 'relevance' ? 'Pertinence' : value === 'rating' ? 'Note' : value === 'distance' ? 'Distance' : value === 'name' ? 'Nom' : 'Plus récents'}`;
      default:
        return key;
    }
  };

  const getFilterColor = (key: string) => {
    switch (key) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'premium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'openNow':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hasParking':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'hasWifi':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'minRating':
      case 'maxRating':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'priceRange':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activeFilters = Object.entries(filters).filter(([_, value]) => 
    value !== undefined && value !== null && value !== ''
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm font-medium text-gray-600">Filtres actifs:</span>
      
      {activeFilters.map(([key, value]) => {
        const Icon = getFilterIcon(key);
        const label = getFilterLabel(key, value);
        const colorClass = getFilterColor(key);

        return (
          <div
            key={key}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${colorClass} ${isRTL ? 'space-x-reverse' : ''}`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{label}</span>
            <button
              onClick={() => onRemoveFilter(key as keyof FilterOptions)}
              className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
              aria-label={`Supprimer le filtre ${label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors"
        >
          Tout effacer
        </button>
      )}
    </div>
  );
};

export default FilterChips;