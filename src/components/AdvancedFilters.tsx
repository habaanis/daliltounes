import React, { useState } from 'react';
import { Filter, X, Star, Clock, MapPin, Wifi, Car, CreditCard, Users, Accessibility } from 'lucide-react';
import { EstablishmentCategory, Governorate } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useDebounce } from '../hooks/useDebounce';
import { subcategoriesByCategory } from '../data/subcategories';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  category?: EstablishmentCategory;
  subcategory?: string;
  governorate?: Governorate;
  verified?: boolean;
  premium?: boolean;
  minRating?: number;
  maxRating?: number;
  openNow?: boolean;
  hasParking?: boolean;
  hasWifi?: boolean;
  acceptsCards?: boolean;
  wheelchairAccessible?: boolean;
  familyFriendly?: boolean;
  priceRange?: 'budget' | 'moderate' | 'expensive';
  distance?: number;
  sortBy?: 'relevance' | 'rating' | 'distance' | 'name' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce pour la recherche dans les filtres
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const categories: EstablishmentCategory[] = [
    'hotel', 'cultural', 'administrative', 'sport', 'animal', 'construction', 'alimentation', 'sante', 'justice', 'ecole', 'taxi', 'tourism', 'divers'
  ];

  const governorates: Governorate[] = [
    'tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte',
    'beja', 'jendouba', 'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax',
    'kairouan', 'kasserine', 'sidi-bouzid', 'gabes', 'medenine', 'tataouine',
    'gafsa', 'tozeur', 'kebili'
  ];

  // Update available subcategories when component mounts or filters change
  React.useEffect(() => {
    if (filters.category) {
      setAvailableSubcategories(subcategoriesByCategory[filters.category] || []);
    } else {
      setAvailableSubcategories([]);
    }
  }, [filters.category]);
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset subcategory when category changes
      ...(key === 'category' ? { subcategory: undefined } : {})
    }));
  };

  // Filtrer les catégories et gouvernorats selon le terme de recherche
  const filteredCategories = categories.filter(category => 
    !debouncedSearchTerm || t(category).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  
  const filteredGovernorates = governorates.filter(gov => 
    !debouncedSearchTerm || t(gov).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  const clearAllFilters = () => {
    setFilters({});
  };

  const applyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <Filter className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Filtres avancés</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                  {getActiveFiltersCount()} actifs
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Barre de recherche dans les filtres */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans les filtres..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Localisation et catégorie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="inline h-4 w-4 mr-2" />
                Gouvernorat
              </label>
              <select
                value={filters.governorate || ''}
                onChange={(e) => handleFilterChange('governorate', e.target.value || undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tous les gouvernorats</option>
                {filteredGovernorates.map(gov => (
                  <option key={gov} value={gov}>
                    {t(gov)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sous-catégorie */}
            {filters.category && availableSubcategories.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sous-catégorie
                </label>
                <select
                  value={filters.subcategory || ''}
                  onChange={(e) => handleFilterChange('subcategory', e.target.value || undefined)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Filter className="inline h-4 w-4 mr-2" />
                Catégorie
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {filteredCategories.map(category => (
                  <option key={category} value={category}>
                    {t(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Qualité et certification */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualité et certification</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified || false}
                  onChange={(e) => handleFilterChange('verified', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Vérifiés</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.premium || false}
                  onChange={(e) => handleFilterChange('premium', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Premium</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.openNow || false}
                  onChange={(e) => handleFilterChange('openNow', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Ouvert maintenant</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.familyFriendly || false}
                  onChange={(e) => handleFilterChange('familyFriendly', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Familial</span>
                </div>
              </label>
            </div>
          </div>

          {/* Services et équipements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Services et équipements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasParking || false}
                  onChange={(e) => handleFilterChange('hasParking', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Parking</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.hasWifi || false}
                  onChange={(e) => handleFilterChange('hasWifi', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">WiFi gratuit</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.acceptsCards || false}
                  onChange={(e) => handleFilterChange('acceptsCards', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium">Cartes acceptées</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.wheelchairAccessible || false}
                  onChange={(e) => handleFilterChange('wheelchairAccessible', e.target.checked || undefined)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Accessibility className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Accessible PMR</span>
                </div>
              </label>
            </div>
          </div>

          {/* Note et prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Star className="inline h-4 w-4 mr-2" />
                Note minimale
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('minRating', rating === filters.minRating ? undefined : rating)}
                    className={`flex items-center space-x-1 px-4 py-3 rounded-lg border transition-all ${
                      filters.minRating === rating
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Star className={`h-4 w-4 ${filters.minRating === rating ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">{rating}+</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gamme de prix
              </label>
              <div className="space-y-3">
                {[
                  { value: 'budget', label: 'Économique', desc: 'Prix abordables' },
                  { value: 'moderate', label: 'Modéré', desc: 'Bon rapport qualité-prix' },
                  { value: 'expensive', label: 'Haut de gamme', desc: 'Services premium' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      value={option.value}
                      checked={filters.priceRange === option.value}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Distance et tri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Distance maximale
              </label>
              <select
                value={filters.distance || ''}
                onChange={(e) => handleFilterChange('distance', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes distances</option>
                <option value="1">Dans un rayon de 1 km</option>
                <option value="5">Dans un rayon de 5 km</option>
                <option value="10">Dans un rayon de 10 km</option>
                <option value="25">Dans un rayon de 25 km</option>
                <option value="50">Dans un rayon de 50 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Trier par
              </label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Pertinence</option>
                <option value="rating">Note</option>
                <option value="distance">Distance</option>
                <option value="name">Nom alphabétique</option>
                <option value="newest">Plus récents</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-between items-center">
            <button
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Effacer tous les filtres
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Appliquer les filtres ({getActiveFiltersCount()})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;