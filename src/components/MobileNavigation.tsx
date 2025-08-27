import React from 'react';
import { Home, Search, Heart, User, Plus } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSuggestClick: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onSuggestClick 
}) => {
  const { t, isRTL } = useLanguage();

  const tabs = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'search', icon: Search, label: 'Recherche' },
    { id: 'suggest', icon: Plus, label: 'Suggérer', action: onSuggestClick },
    { id: 'favorites', icon: Heart, label: 'Favoris' },
    { id: 'profile', icon: User, label: 'Profil' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => tab.action ? tab.action() : onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              } ${tab.id === 'suggest' ? 'relative' : ''}`}
            >
              {tab.id === 'suggest' ? (
                <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <Icon className="h-5 w-5" />
                </div>
              ) : (
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              )}
              <span className={`text-xs font-medium ${
                tab.id === 'suggest' ? 'text-blue-600' : ''
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;