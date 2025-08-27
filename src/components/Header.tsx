import React from 'react';
import { MapPin, Phone, Menu, X, Plus, Mail } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onSuggestClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen, onSuggestClick }) => {
  const { t, isRTL } = useLanguage();

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('appName')}</h1>
              <p className="text-sm text-gray-600 font-medium">{t('appSubtitle')}</p>
            </div>
          </div>
          
          <nav className={`hidden md:flex items-center space-x-8 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 hover:scale-105 transform"
            >
              {t('home')}
            </button>
            <button 
              onClick={() => {
                const establishmentsSection = document.getElementById('main-content');
                if (establishmentsSection) {
                  establishmentsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 hover:scale-105 transform"
            >
              {t('establishments')}
            </button>
            <button 
              onClick={() => {
                const subscriptionsSection = document.querySelector('[data-section="subscriptions"]');
                if (subscriptionsSection) {
                  subscriptionsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 hover:scale-105 transform"
            >
              {t('subscriptions')}
            </button>
            <button 
              onClick={onSuggestClick}
              className={`flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-bold">{t('suggestEstablishment')}</span>
            </button>
            <button 
              onClick={() => {
                const footerSection = document.querySelector('footer');
                if (footerSection) {
                  footerSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 hover:scale-105 transform"
            >
              {t('contact')}
            </button>
          </nav>

          <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            <LanguageSelector />
            <div className={`hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl ${isRTL ? 'space-x-reverse' : ''}`}>
              <Mail className="h-4 w-4 text-blue-600" />
              <a href="mailto:contact@dalil-tounes.com" className="font-semibold hover:text-blue-600 transition-colors">
                contact@dalil-tounes.com
              </a>
            </div>
            <button
              onClick={onMenuToggle}
              className="md:hidden p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-6">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onMenuToggle();
                }}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 text-left"
              >
                {t('home')}
              </button>
              <button 
                onClick={() => {
                  const establishmentsSection = document.getElementById('main-content');
                  if (establishmentsSection) {
                    establishmentsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  onMenuToggle();
                }}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 text-left"
              >
                {t('establishments')}
              </button>
              <button 
                onClick={() => {
                  const subscriptionsSection = document.querySelector('[data-section="subscriptions"]');
                  if (subscriptionsSection) {
                    subscriptionsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  onMenuToggle();
                }}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 text-left"
              >
                {t('subscriptions')}
              </button>
              <button 
                onClick={onSuggestClick}
                className={`flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 w-fit shadow-lg ${isRTL ? 'space-x-reverse' : ''}`}
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm font-bold">{t('suggestEstablishment')}</span>
              </button>
              <button 
                onClick={() => {
                  const footerSection = document.querySelector('footer');
                  if (footerSection) {
                    footerSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  onMenuToggle();
                }}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 text-left"
              >
                {t('contact')}
              </button>
              <div className={`flex items-center space-x-2 text-sm text-gray-600 pt-4 border-t bg-gray-100 px-4 py-3 rounded-xl ${isRTL ? 'space-x-reverse' : ''}`}>
                <Mail className="h-4 w-4 text-blue-600" />
                <a href="mailto:contact@dalil-tounes.com" className="font-semibold hover:text-blue-600 transition-colors">
                  contact@dalil-tounes.com
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;