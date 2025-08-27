import React from 'react';
import { MapPin } from 'lucide-react';
import { Governorate } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface GovernorateFilterProps {
  selectedGovernorate: Governorate | null;
  onGovernorateChange: (governorate: Governorate | null) => void;
}

const governorates: Governorate[] = [
  'tunis', 'ariana', 'ben-arous', 'manouba',
  'nabeul', 'zaghouan', 'bizerte',
  'beja', 'jendouba', 'kef', 'siliana',
  'sousse', 'monastir', 'mahdia', 'sfax',
  'kairouan', 'kasserine', 'sidi-bouzid',
  'gabes', 'medenine', 'tataouine',
  'gafsa', 'tozeur', 'kebili'
];

const GovernorateFilter: React.FC<GovernorateFilterProps> = ({ 
  selectedGovernorate, 
  onGovernorateChange 
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <MapPin className="h-5 w-5" />
        <span>Gouvernorats</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <button
          onClick={() => onGovernorateChange(null)}
          className={`p-3 rounded-lg border-2 transition-all text-sm ${
            selectedGovernorate === null
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {t('all')}
        </button>
        
        {governorates.map((governorate) => (
          <button
            key={governorate}
            onClick={() => onGovernorateChange(governorate)}
            className={`p-3 rounded-lg border-2 transition-all text-sm ${
              selectedGovernorate === governorate
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {t(governorate)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GovernorateFilter;