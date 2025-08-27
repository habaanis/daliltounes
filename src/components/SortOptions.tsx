import React from 'react';
import { ArrowUpDown, Star, MapPin, Clock, MoreVertical as AlphabeticalSort } from 'lucide-react';

interface SortOptionsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  className = ''
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Pertinence', icon: ArrowUpDown },
    { value: 'rating', label: 'Note', icon: Star },
    { value: 'distance', label: 'Distance', icon: MapPin },
    { value: 'name', label: 'Nom', icon: AlphabeticalSort },
    { value: 'newest', label: 'Plus récents', icon: Clock }
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-600">Trier par:</span>
      
      <div className="flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = sortBy === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => {
                if (isActive && option.value !== 'relevance') {
                  // Toggle sort order for active option (except relevance)
                  onSortChange(option.value, sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  // Set new sort option
                  onSortChange(option.value, option.value === 'name' ? 'asc' : 'desc');
                }
              }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
              {isActive && option.value !== 'relevance' && (
                <span className="text-xs">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortOptions;