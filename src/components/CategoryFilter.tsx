import React from 'react';
import { Hotel, Palette, Building, Activity, PawPrint, Hammer, ShoppingCart, MapPin, Filter, Heart, Scale, GraduationCap, Car, Stethoscope, Wrench, Utensils } from 'lucide-react';
import { EstablishmentCategory } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useDebounce } from '../hooks/useDebounce';

interface CategoryFilterProps {
  selectedCategory: EstablishmentCategory | null;
  onCategoryChange: (category: EstablishmentCategory | null) => void;
}

const categories = [
  { id: 'hotel' as EstablishmentCategory, icon: Hotel, color: 'bg-purple-500' },
  { id: 'cultural' as EstablishmentCategory, icon: Palette, color: 'bg-pink-500' },
  { id: 'administrative' as EstablishmentCategory, icon: Building, color: 'bg-blue-500' },
  { id: 'sport' as EstablishmentCategory, icon: Activity, color: 'bg-green-500' },
  { id: 'animal' as EstablishmentCategory, icon: PawPrint, color: 'bg-yellow-500' },
  { id: 'construction' as EstablishmentCategory, icon: Wrench, color: 'bg-gray-600' },
  { id: 'alimentation' as EstablishmentCategory, icon: Utensils, color: 'bg-indigo-500' },
  { id: 'sante' as EstablishmentCategory, icon: Stethoscope, color: 'bg-red-500' },
  { id: 'justice' as EstablishmentCategory, icon: Scale, color: 'bg-amber-600' },
  { id: 'ecole' as EstablishmentCategory, icon: GraduationCap, color: 'bg-emerald-600' },
  { id: 'taxi' as EstablishmentCategory, icon: Car, color: 'bg-orange-500' },
  { id: 'tourism' as EstablishmentCategory, icon: MapPin, color: 'bg-teal-500' },
  { id: 'divers' as EstablishmentCategory, icon: Filter, color: 'bg-slate-500' }
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onCategoryChange }) => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  
  // Filtrer les catégories selon le terme de recherche
  const filteredCategories = categories.filter(category => 
    !debouncedSearchTerm || t(category.id).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className={`flex items-center space-x-3 mb-6 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
        <Filter className="h-6 w-6 text-blue-600" />
        <h3 className={`text-xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
          Catégories Populaires
        </h3>
      </div>
      
      {/* Barre de recherche pour les catégories */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une catégorie..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
      
      {/* Catégories populaires en premier */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Les Plus Recherchées</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['sante', 'alimentation', 'construction', 'justice'].map((categoryId) => {
            const category = categories.find(cat => cat.id === categoryId);
            if (!category) return null;
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold">{t(category.id)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <button
          onClick={() => onCategoryChange(null)}
          className={`p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
            selectedCategory === null
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          }`} aria-label="Toutes les catégories"
        >
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
              <span className="text-white text-xs font-bold">All</span>
            </div>
            <span className="text-sm font-semibold">{t('all')}</span>
          </div>
        </button>
        
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`p-5 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`} aria-label={`Catégorie ${t(category.id)}`}
            >
              <div className="text-center">
                <div className={`w-10 h-10 ${category.color} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold">{t(category.id)}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {filteredCategories.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune catégorie trouvée pour "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;