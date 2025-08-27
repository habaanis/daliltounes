import React, { useState, useEffect } from 'react';
import { Search, Mic, MicOff, Filter, X, Star, CheckCircle, Crown, Clock, MapPin  } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchIndex, searchInIndex } from '../hooks/useSearchIndex';
import { useLanguage } from '../hooks/useLanguage';
import { EstablishmentCategory, Governorate, Establishment } from '../types';
import { subcategoriesByCategory } from '../data/subcategories';

import { establishments } from '../data/establishments';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  onEstablishmentSelect?: (establishment: Establishment) => void;
  establishments?: Establishment[];
}

interface SearchFilters {
  category?: EstablishmentCategory;
  subcategory?: string;
  governorate?: Governorate;
  verified?: boolean;
  premium?: boolean;
  minRating?: number;
  openNow?: boolean;
  hasParking?: boolean;
  hasWifi?: boolean;
  priceRange?: 'budget' | 'moderate' | 'expensive';
  distance?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange, onEstablishmentSelect, establishments: propEstablishments }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Establishment[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useVoiceSearch();
  const { t, language, isRTL } = useLanguage();
  
  // Optimisation avec debounce
  const debouncedQuery = useDebounce(query, 300);
  const searchIndex = useSearchIndex(propEstablishments || establishments);

  const categories: EstablishmentCategory[] = [
    'hotel', 'cultural', 'administrative', 'sport', 'animal', 'construction', 'alimentation', 'sante', 'justice', 'ecole', 'taxi', 'tourism', 'divers'
  ];

  const governorates: Governorate[] = [
    'tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte',
    'beja', 'jendouba', 'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax',
    'kairouan', 'kasserine', 'sidi-bouzid', 'gabes', 'medenine', 'tataouine',
    'gafsa', 'tozeur', 'kebili'
  ];

  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
      resetTranscript();
    }
  }, [transcript, onSearch, resetTranscript]);

  // Recherche optimisée avec debounce
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.length >= 1) {
      onSearch(debouncedQuery);
    } else if (debouncedQuery === '') {
      onSearch('');
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    // Compter les filtres actifs
    const count = Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
    setActiveFiltersCount(count);
    
    // Appeler onFilterChange si fourni
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);

  // Generate search suggestions based on query
  useEffect(() => {
    if (query.length >= 1) {
      setIsSearching(true);
      
      // Utiliser l'index de recherche pour des suggestions plus rapides
      const searchResults = searchInIndex(searchIndex, query);
      setSearchResults(searchResults.slice(0, 12));
      
      const suggestions = new Set<string>();
      
      // Ajouter les noms des établissements trouvés
      searchResults.slice(0, 8).forEach(est => {
        suggestions.add(est.name);
      });
      
      // Ajouter les sous-catégories uniques
      const subcategories = new Set(searchResults.map(est => est.subcategory));
      Array.from(subcategories).slice(0, 5).forEach(sub => {
        suggestions.add(sub);
      });
      
      // Add category translations
      categories.forEach(category => {
        const categoryName = t(category);
        if (categoryName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(categoryName);
        }
      });
      
      // Add governorate translations
      governorates.forEach(gov => {
        const govName = t(gov);
        if (govName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(govName);
        }
      });
      
      setSearchSuggestions(Array.from(suggestions).slice(0, 10));
      setShowSuggestions(true);
      setShowResults(searchResults.length > 0);
      setIsSearching(false);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
      setShowResults(false);
    }
  }, [query, t, searchIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setShowResults(false);
  };

  const handleEstablishmentClick = (establishment: Establishment) => {
    if (onEstablishmentSelect) {
      onEstablishmentSelect(establishment);
    }
    setShowSuggestions(false);
    setShowResults(false);
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset subcategory when category changes
      ...(key === 'category' ? { subcategory: undefined } : {})
    }));
    
    // Update available subcategories when category changes
    if (key === 'category') {
      setAvailableSubcategories(value ? subcategoriesByCategory[value as EstablishmentCategory] || [] : []);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const clearFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const quickFilters = [
    { key: 'verified', label: 'Vérifiés', icon: CheckCircle, color: 'text-green-600' },
    { key: 'premium', label: 'Premium', icon: Crown, color: 'text-yellow-600' },
    { key: 'openNow', label: 'Ouvert maintenant', icon: Clock, color: 'text-blue-600' },
    { key: 'hasParking', label: 'Parking', icon: MapPin, color: 'text-purple-600' },
  ];

  return (
    <div className="relative group">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <Search className={`absolute ${isRTL ? 'right-6' : 'left-6'} h-6 w-6 text-gray-400 group-focus-within:text-blue-500 transition-colors`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher : médecin, restaurant, plombier, avocat..."
            className={`w-full ${isRTL ? 'pr-16 pl-32' : 'pl-16 pr-32'} py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-lg hover:shadow-xl bg-white ${isRTL ? 'text-right' : 'text-left'} placeholder-gray-400 ${isSearching ? 'bg-blue-50' : ''}`}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-label="Rechercher un établissement"
            onFocus={() => query.length >= 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => { setShowSuggestions(false); setShowResults(false); }, 300)}
            autoComplete="off"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSuggestions(false);
                setShowResults(false);
              }
            }}
          />
          
          {/* Indicateur de recherche */}
          {isSearching && (
            <div className={`absolute ${isRTL ? 'right-20' : 'left-20'} top-1/2 transform -translate-y-1/2`}>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <div className={`absolute ${isRTL ? 'left-6' : 'right-6'} flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-3 rounded-full transition-all shadow-md hover:shadow-lg ${
                activeFiltersCount > 0 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
              aria-label="Filtres de recherche"
            >
              <Filter className="h-5 w-5" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            {isSupported && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`p-3 rounded-full transition-all shadow-md hover:shadow-lg ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse scale-110' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                }`}
                aria-label={isListening ? 'Arrêter l\'écoute vocale' : 'Recherche vocale'}
              >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search Suggestions */}
      {(showSuggestions || showResults) && query.length >= 1 && (searchSuggestions.length > 0 || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-96 overflow-y-auto backdrop-blur-sm">
          {/* Suggestions de recherche */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="border-b border-gray-100">
              <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">
                Suggestions ({searchSuggestions.length})
              </div>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 ${isRTL ? 'text-right' : 'text-left'} group`}
                >
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                    <span className="text-gray-900 font-medium group-hover:text-blue-700">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Résultats d'établissements */}
          {showResults && searchResults.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">
                Établissements ({searchResults.length} résultats)
              </div>
              {searchResults.map((establishment) => (
                <button
                  key={`result-${establishment.id}`}
                  onClick={() => handleEstablishmentClick(establishment)}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 ${isRTL ? 'text-right' : 'text-left'} group`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={establishment.image} 
                        alt={establishment.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                        {establishment.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {establishment.subcategory} • {t(establishment.governorate)}
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-600 ml-1">{establishment.rating}</span>
                        </div>
                        {establishment.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Vérifié
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtres rapides */}
      {activeFiltersCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
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
                case 'openNow':
                  return 'Ouvert maintenant';
                case 'hasParking':
                  return 'Parking';
                case 'hasWifi':
                  return 'WiFi';
                case 'priceRange':
                  return value === 'budget' ? 'Économique' : value === 'moderate' ? 'Modéré' : 'Haut de gamme';
                case 'distance':
                  return `${value}km`;
                default:
                  return key;
              }
            };

            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span>{getFilterLabel(key, value)}</span>
                <button
                  onClick={() => clearFilter(key as keyof SearchFilters)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-blue-50 rounded transition-colors"
          >
            Tout effacer
          </button>
        </div>
      )}
      
      {/* Panneau de filtres étendu */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-96 overflow-y-auto">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h3 className="text-xl font-bold text-gray-900">Filtres de recherche</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Fermer les filtres"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filtres rapides */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Filtres rapides</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickFilters.map((filter) => {
                const Icon = filter.icon;
                const isActive = filters[filter.key as keyof SearchFilters];
                return (
                  <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key as keyof SearchFilters, !isActive)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : filter.color}`} />
                    <span className="text-sm font-medium">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Catégorie
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(category)}
                  </option>
                ))}
              </select>
            </div>

            {/* Gouvernorat */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gouvernorat
              </label>
              <select
                value={filters.governorate || ''}
                onChange={(e) => handleFilterChange('governorate', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les gouvernorats</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>
                    {t(gov)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sous-catégorie */}
            {filters.category && availableSubcategories.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sous-catégorie
                </label>
                <select
                  value={filters.subcategory || ''}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Toutes les sous-catégories</option>
                  {availableSubcategories.map(subcategory => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Note minimale */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Note minimale
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('minRating', rating === filters.minRating ? undefined : rating)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-all ${
                      filters.minRating === rating
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${filters.minRating === rating ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    <span className="text-sm">{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gamme de prix */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gamme de prix
              </label>
              <div className="space-y-2">
                {[
                  { value: 'budget', label: 'Économique (€)' },
                  { value: 'moderate', label: 'Modéré (€€)' },
                  { value: 'expensive', label: 'Haut de gamme (€€€)' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={filters.priceRange === option.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Distance maximale
              </label>
              <select
                value={filters.distance || ''}
                onChange={(e) => handleFilterChange('distance', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes distances</option>
                <option value="1">1 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
            </div>

            {/* Services supplémentaires */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Services
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.hasWifi || false}
                    onChange={(e) => handleFilterChange('hasWifi', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">WiFi gratuit</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Effacer tous les filtres
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl shadow-lg animate-pulse">
          <p className={`text-red-600 text-base font-medium ${isRTL ? 'text-right' : 'text-left'} flex items-center justify-center space-x-2`}>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            {t('listening')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;