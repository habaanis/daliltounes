import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "daliltounes - Guide complet des établissements tunisiens | Hôtels, Restaurants, Services",
  description = "Découvrez plus de 2000 établissements en Tunisie avec daliltounes. Guide complet des hôtels, restaurants, services administratifs, culturels et touristiques dans tous les gouvernorats tunisiens.",
  keywords = "daliltounes, Tunisie, établissements tunisiens, hôtels Tunisie, restaurants Tunisie, guide Tunisie, tourisme Tunisie, services Tunisie, annuaire Tunisie, business Tunisie, Tunis, Sousse, Sfax",
  canonical = "https://www.dalil-tounes.com/",
  ogImage = "https://www.dalil-tounes.com/icons/icon-512x512.png"
}) => {
  const { language } = useLanguage();

  React.useEffect(() => {
    // Mettre à jour le titre de la page
    document.title = title;
    
    // Mettre à jour les meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Mettre à jour les meta tags SEO
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('language', language);
    
    // Mettre à jour Open Graph
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', ogImage);
    updatePropertyTag('og:url', canonical);
    
    // Mettre à jour Twitter Cards
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    
    // Mettre à jour le canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
    
  }, [title, description, keywords, canonical, ogImage, language]);

  return null; // Ce composant ne rend rien visuellement
};

export default SEOHead;