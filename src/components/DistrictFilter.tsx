import React from 'react';
import { MapPin } from 'lucide-react';
import { TunisDistrict } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface DistrictFilterProps {
  selectedDistrict: TunisDistrict | null;
  onDistrictChange: (district: TunisDistrict | null) => void;
  show: boolean;
}

const tunisDistricts: TunisDistrict[] = [
  'medina', 'bab-bhar', 'bab-souika', 'halfaouine', 'omrane', 'omrane-superieur',
  'cite-olympique', 'el-menzah', 'ariana-ville', 'ennasr', 'manar', 'centre-ville',
  'lafayette', 'passage', 'belvédère', 'mutuelleville', 'montplaisir', 'monfleury',
  'notre-dame', 'bardo', 'zahrouni', 'kabaria', 'mellassine', 'hrairia',
  'sidi-hassine', 'intilaka', 'khadra', 'sijoumi'
];

const DistrictFilter: React.FC<DistrictFilterProps> = ({ 
  selectedDistrict, 
  onDistrictChange,
  show 
}) => {
  const { t, isRTL } = useLanguage();

  if (!show) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <h3 className={`text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
        <MapPin className="h-5 w-5" />
        <span>Quartiers de Tunis</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        <button
          onClick={() => onDistrictChange(null)}
          className={`p-3 rounded-lg border-2 transition-all text-sm ${
            selectedDistrict === null
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {t('all')}
        </button>
        
        {tunisDistricts.map((district) => (
          <button
            key={district}
            onClick={() => onDistrictChange(district)}
            className={`p-3 rounded-lg border-2 transition-all text-sm ${
              selectedDistrict === district
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {t(district)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DistrictFilter;