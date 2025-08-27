import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';
import { useLanguage } from '../hooks/useLanguage';

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  const languages = [
    { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
    { code: 'ar' as Language, name: 'العربية', flag: '🇹🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
    { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
      </button>
      
      <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
              language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;