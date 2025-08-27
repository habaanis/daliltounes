import React from 'react';
import { Stethoscope, Utensils, Wrench, Scale, GraduationCap, Car, Hotel, Building } from 'lucide-react';
import { EstablishmentCategory } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface QuickCategoriesSectionProps {
  onCategorySelect: (category: EstablishmentCategory) => void;
}

const QuickCategoriesSection: React.FC<QuickCategoriesSectionProps> = ({ onCategorySelect }) => {
  const { t, isRTL } = useLanguage();

  const popularCategories = [
    { id: 'sante' as EstablishmentCategory, icon: Stethoscope, color: 'bg-red-500', label: 'Médecins & Santé' },
    { id: 'alimentation' as EstablishmentCategory, icon: Utensils, color: 'bg-indigo-500', label: 'Restaurants & Cafés' },
    { id: 'construction' as EstablishmentCategory, icon: Wrench, color: 'bg-gray-600', label: 'Artisans & BTP' },
    { id: 'justice' as EstablishmentCategory, icon: Scale, color: 'bg-amber-600', label: 'Avocats & Notaires' },
    { id: 'ecole' as EstablishmentCategory, icon: GraduationCap, color: 'bg-emerald-600', label: 'Écoles & Formation' },
    { id: 'taxi' as EstablishmentCategory, icon: Car, color: 'bg-orange-500', label: 'Transport & Taxi' },
    { id: 'hotel' as EstablishmentCategory, icon: Hotel, color: 'bg-purple-500', label: 'Hôtels & Hébergement' },
    { id: 'administrative' as EstablishmentCategory, icon: Building, color: 'bg-blue-500', label: 'Services Publics' }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Services les Plus Recherchés
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Accédez rapidement aux professionnels et services dont vous avez besoin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {popularCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200 touch-manipulation min-h-[120px]"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                    {category.label}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => {
              const categoriesSection = document.querySelector('[data-section="categories"]');
              if (categoriesSection) {
                categoriesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl min-h-[48px] touch-target"
          >
            Voir Toutes les Catégories
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickCategoriesSection;