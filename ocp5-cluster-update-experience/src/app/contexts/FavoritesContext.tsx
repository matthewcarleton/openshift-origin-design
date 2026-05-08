import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Favorite {
  id: string;
  name: string;
  path: string;
  type: 'page' | 'resource';
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (name: string, path: string, type: 'page' | 'resource') => boolean;
  removeFavorite: (id: string) => void;
  isFavorite: (path: string) => boolean;
  maxFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const MAX_FAVORITES = 10;

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('openshift-favorites');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openshift-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addFavorite = (name: string, path: string, type: 'page' | 'resource'): boolean => {
    if (favorites.length >= MAX_FAVORITES) {
      return false; // Max limit reached
    }

    if (favorites.some(f => f.path === path)) {
      return true; // Already favorited
    }

    const newFavorite: Favorite = {
      id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      path,
      type
    };

    setFavorites(prev => [...prev, newFavorite]);
    return true;
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  const isFavorite = (path: string): boolean => {
    return favorites.some(f => f.path === path);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, maxFavorites: MAX_FAVORITES }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
