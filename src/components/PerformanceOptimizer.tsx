import React, { useEffect } from 'react';


const PerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    // Fonctions d'optimisation
    const preloadCriticalResources = () => {
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      document.head.appendChild(fontLink);
    };

    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src || '';
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        }, { rootMargin: '50px 0px' });
        images.forEach((img) => imageObserver.observe(img));
      }
    };

    const deferNonCriticalScripts = () => {
      const scripts = document.querySelectorAll('script[data-defer]');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.src = script.getAttribute('src') || '';
        newScript.async = true;
        document.head.appendChild(newScript);
      });
    };

    const optimizeBrowserCache = () => {
      const cacheMetaTag = document.createElement('meta');
      cacheMetaTag.httpEquiv = 'Cache-Control';
      cacheMetaTag.content = 'public, max-age=31536000';
      document.head.appendChild(cacheMetaTag);
    };

   

    // Exécuter les optimisations au chargement
    const executeOptimizations = () => {
      preloadCriticalResources();
      optimizeImages();
      deferNonCriticalScripts();
      optimizeBrowserCache();
    };

    // Lancer les optimisations
    if (document.readyState === 'complete') {
      executeOptimizations();
    } else {
      window.addEventListener('load', executeOptimizations);
    }

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener('load', executeOptimizations);
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;