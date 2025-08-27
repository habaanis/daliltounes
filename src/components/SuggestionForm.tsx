import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { EstablishmentCategory, Governorate } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { addEstablishmentToSupabase } from '../services/supabaseEstablishments';

interface SuggestionFormProps {
  onClose: () => void;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ onClose }) => {
  const { t, isRTL } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as EstablishmentCategory,
    subcategory: '',
    description: '',
    address: '',
    governorate: '' as Governorate,
    phone: '',
    email: '',
    website: '',
    hours: '',
    services: '',
    suggestedBy: '',
    suggestedByEmail: ''
  });

  const categories: EstablishmentCategory[] = [
    'hotel', 'cultural', 'administrative', 'sport', 'animal', 'construction', 'alimentation', 'sante', 'justice', 'ecole', 'taxi', 'tourism', 'divers'
  ];

  const governorates: Governorate[] = [
    'tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte',
    'beja', 'jendouba', 'kef', 'siliana', 'sousse', 'monastir', 'mahdia', 'sfax',
    'kairouan', 'kasserine', 'sidi-bouzid', 'gabes', 'medenine', 'tataouine',
    'gafsa', 'tozeur', 'kebili'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Envoyer les données à Supabase
    const submitToSupabase = async () => {
      try {
        const establishmentData = {
          name: formData.name,
          category: formData.category,
          subcategory: formData.subcategory,
          description: formData.description,
          address: formData.address,
          governorate: formData.governorate,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          hours: formData.hours,
          services: formData.services.split(',').map(s => s.trim()).filter(s => s),
          coordinates: {
            lat: 36.8065, // Coordonnées par défaut (centre Tunisie)
            lng: 10.1815
          }
        };

        const recordId = await addEstablishmentToSupabase(establishmentData);
        
        if (recordId) {
          console.log('✅ Suggestion ajoutée à Supabase:', recordId);
          setIsSubmitted(true);
          
          // Fermer le formulaire après 3 secondes
          setTimeout(() => {
            onClose();
          }, 3000);
        } else {
          throw new Error('Échec de l\'ajout à Supabase');
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'ajout à Supabase:', error);
        alert('Erreur lors de l\'envoi de la suggestion. Veuillez réessayer.');
      }
    };

    submitToSupabase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Merci !</h3>
          <p className="text-gray-600">{t('suggestionSuccess')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div>
              <h2 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('suggestTitle')}
              </h2>
              <p className={`text-gray-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('suggestSubtitle')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('establishmentName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('category')} <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {t(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('subcategory')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('governorate')} <span className="text-red-500">*</span>
              </label>
              <select
                name="governorate"
                value={formData.governorate}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <option value="">Sélectionner un gouvernorat</option>
                {governorates.map(gov => (
                  <option key={gov} value={gov}>
                    {t(gov)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('website')}
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('openingHours')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                required
                placeholder="Ex: 08h00 - 18h00"
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('address')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('servicesOffered')}
            </label>
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleInputChange}
              placeholder="Service 1, Service 2, Service 3..."
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('yourName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="suggestedBy"
                value={formData.suggestedBy}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('yourEmail')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="suggestedByEmail"
                value={formData.suggestedByEmail}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isRTL ? 'text-right' : 'text-left'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className={`flex space-x-4 pt-6 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}
            >
              <Plus className="h-5 w-5" />
              <span>{t('submitSuggestion')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuggestionForm;