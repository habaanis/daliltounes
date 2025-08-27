import { useMemo } from 'react';
import { Establishment } from '../types';

interface SearchIndex {
  byName: Map<string, Establishment[]>;
  byCategory: Map<string, Establishment[]>;
  byGovernorate: Map<string, Establishment[]>;
  byServices: Map<string, Establishment[]>;
  byAddress: Map<string, Establishment[]>;
  bySubcategory: Map<string, Establishment[]>;
}

export const useSearchIndex = (establishments: Establishment[]) => {
  return useMemo(() => {
    const index: SearchIndex = {
      byName: new Map(),
      byCategory: new Map(),
      byGovernorate: new Map(),
      byServices: new Map(),
      byAddress: new Map(),
      bySubcategory: new Map()
    };

    establishments.forEach(establishment => {
      // Index par nom (mots-clés)
      const nameWords = establishment.name.toLowerCase().split(' ');
      nameWords.forEach(word => {
        if (word.length > 2) {
          if (!index.byName.has(word)) {
            index.byName.set(word, []);
          }
          index.byName.get(word)!.push(establishment);
        }
      });

      // Index par catégorie
      if (!index.byCategory.has(establishment.category)) {
        index.byCategory.set(establishment.category, []);
      }
      index.byCategory.get(establishment.category)!.push(establishment);

      // Index par gouvernorat
      if (!index.byGovernorate.has(establishment.governorate)) {
        index.byGovernorate.set(establishment.governorate, []);
      }
      index.byGovernorate.get(establishment.governorate)!.push(establishment);

      // Index par services
      establishment.services.forEach(service => {
        const serviceWords = service.toLowerCase().split(' ');
        serviceWords.forEach(word => {
          if (word.length > 2) {
            if (!index.byServices.has(word)) {
              index.byServices.set(word, []);
            }
            index.byServices.get(word)!.push(establishment);
          }
        });
      });

      // Index par adresse
      const addressWords = establishment.address.toLowerCase().split(' ');
      addressWords.forEach(word => {
        if (word.length > 2) {
          if (!index.byAddress.has(word)) {
            index.byAddress.set(word, []);
          }
          index.byAddress.get(word)!.push(establishment);
        }
      });

      // Index par sous-catégorie
      const subcategoryWords = establishment.subcategory.toLowerCase().split(' ');
      subcategoryWords.forEach(word => {
        if (word.length > 2) {
          if (!index.bySubcategory.has(word)) {
            index.bySubcategory.set(word, []);
          }
          index.bySubcategory.get(word)!.push(establishment);
        }
      });
    });

    return index;
  }, [establishments]);
};

export const searchInIndex = (index: SearchIndex, query: string): Establishment[] => {
  if (!query || query.length < 2) return [];

  const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 1);
  const results = new Set<Establishment>();

  queryWords.forEach(word => {
    // Recherche exacte
    index.byName.get(word)?.forEach(est => results.add(est));
    index.byServices.get(word)?.forEach(est => results.add(est));
    index.byAddress.get(word)?.forEach(est => results.add(est));
    index.bySubcategory.get(word)?.forEach(est => results.add(est));

    // Recherche partielle (commence par)
    index.byName.forEach((establishments, key) => {
      if (key.startsWith(word)) {
        establishments.forEach(est => results.add(est));
      }
    });

    index.byServices.forEach((establishments, key) => {
      if (key.startsWith(word)) {
        establishments.forEach(est => results.add(est));
      }
    });
  });

  return Array.from(results);
};