import React from 'react';
import { MapPin, Users, Building, Star } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Hero: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="relative py-24 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
      {/* Drapeau tunisien en arrière-plan - Version améliorée */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Drapeau tunisien complet */}
          <div className="w-[800px] h-[500px] relative transform rotate-8 scale-125">
            {/* Fond rouge du drapeau */}
            <div className="w-full h-full bg-red-700 relative shadow-2xl border-4 border-red-800">
              {/* Cercle blanc central */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-gray-200">
                {/* Croissant rouge */}
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-red-700 rounded-full shadow-lg"></div>
                  <div className="absolute top-3 left-3 w-28 h-28 bg-white rounded-full"></div>
                </div>
                {/* Étoile rouge à 5 branches */}
                <svg className="absolute w-16 h-16 text-red-700 ml-10 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drapeau tunisien supplémentaire en arrière-plan (plus petit) */}
      <div className="absolute top-10 right-10 opacity-30">
        <div className="w-48 h-32 relative transform rotate-12">
          <div className="w-full h-full bg-red-700 relative shadow-xl border-2 border-red-800">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-red-700 rounded-full"></div>
                <div className="absolute top-1 left-1 w-7 h-7 bg-white rounded-full"></div>
              </div>
              <svg className="absolute w-4 h-4 text-red-700 ml-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Drapeau tunisien supplémentaire en arrière-plan (gauche) */}
      <div className="absolute bottom-10 left-10 opacity-30 transform -rotate-12">
        <div className="w-48 h-32 relative">
          <div className="w-full h-full bg-red-700 relative shadow-xl border-2 border-red-800">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-red-700 rounded-full"></div>
                <div className="absolute top-1 left-1 w-7 h-7 bg-white rounded-full"></div>
              </div>
              <svg className="absolute w-4 h-4 text-red-700 ml-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-20 rounded-full shadow-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-20 rounded-full shadow-2xl"></div>
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-white opacity-25 rounded-full shadow-xl"></div>
        <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-white opacity-25 rounded-full shadow-xl"></div>
      </div>
      
      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-2xl ${isRTL ? 'font-arabic' : ''} leading-tight`}>
            Dalil Tounes
          </h1>
          
          <p className={`text-xl md:text-3xl text-white mb-12 max-w-3xl mx-auto drop-shadow-lg font-light ${isRTL ? 'font-arabic' : ''} leading-relaxed`}>
            Votre annuaire complet des services et métiers en Tunisie.<br />
            <span className="text-lg md:text-xl font-medium">Trouvez tout, du médecin à l'artisan, en quelques clics.</span>
          </p>
          
          {/* CTA principal plus percutant */}
          <div className="mb-16">
            <button
              onClick={() => {
                const searchElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchElement) {
                  searchElement.focus();
                  searchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
            >
              🔍 Commencer ma recherche
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-white bg-opacity-25 backdrop-blur-lg rounded-2xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white border-opacity-40 shadow-xl hover:scale-110 transition-transform duration-300">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">2,000+</div>
              <div className="text-white text-sm md:text-base drop-shadow-md font-medium">{t('establishments')}</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-25 backdrop-blur-lg rounded-2xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white border-opacity-40 shadow-xl hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">Nouveau</div>
              <div className="text-white text-sm md:text-base drop-shadow-md font-medium">Plateforme</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-25 backdrop-blur-lg rounded-2xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white border-opacity-40 shadow-xl hover:scale-110 transition-transform duration-300">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">100%</div>
              <div className="text-white text-sm md:text-base drop-shadow-md font-medium">Gratuit</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-25 backdrop-blur-lg rounded-2xl p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center border border-white border-opacity-40 shadow-xl hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">24</div>
              <div className="text-white text-sm md:text-base drop-shadow-md font-medium">Gouvernorats</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;