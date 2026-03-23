import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'northstar-favorites';

interface FavoritesContextValue {
  favorites: Set<string>;
  toggle: (pageId: string) => void;
  isFavorite: (pageId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveFavorites(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggle = useCallback((pageId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(pageId)) next.delete(pageId);
      else next.add(pageId);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (pageId: string) => favorites.has(pageId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
