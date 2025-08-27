import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className={`flex items-center space-x-2 mb-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
              <MapPin className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">{t('appName')}</h3>
                <p className="text-gray-400 text-sm">{t('appSubtitle')}</p>
              </div>
            </div>
            <p className={`text-gray-400 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('footerDescription')}
            </p>
            <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('navigation')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('main-content');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('establishments')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('subscriptions-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('subscriptions')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById('footer-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t('contact')}
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('categories')}
            </h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">{t('hotel')}</span></li>
              <li><span className="text-gray-400">{t('cultural')}</span></li>
              <li><span className="text-gray-400">{t('administrative')}</span></li>
              <li><span className="text-gray-400">{t('sport')}</span></li>
              <li><span className="text-gray-400">{t('sante')}</span></li>
              <li><span className="text-gray-400">{t('justice')}</span></li>
              <li><span className="text-gray-400">{t('ecole')}</span></li>
              <li><span className="text-gray-400">{t('taxi')}</span></li>
              <li><span className="text-gray-400">{t('alimentation')}</span></li>
              <li><span className="text-gray-400">{t('divers')}</span></li>
            </ul>
          </div>
          
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('contact')}
            </h4>
            <div className="space-y-3">
              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
                <Mail className="h-5 w-5 text-gray-400" />
                <a href="mailto:contact@dalil-tounes.com" className="text-gray-400 hover:text-white transition-colors">
                  contact@dalil-tounes.com
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Dalil Tounes. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;