import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '../types';

const STORAGE_KEY = '@presticars_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Vehicle[] = JSON.parse(stored);
        setFavorites(parsed);
        setFavoriteIds(new Set(parsed.map(v => v.id)));
      }
    } catch (_) {}
  };

  const toggleFavorite = useCallback(async (vehicle: Vehicle) => {
    setFavorites(prev => {
      let updated: Vehicle[];
      if (prev.find(v => v.id === vehicle.id)) {
        updated = prev.filter(v => v.id !== vehicle.id);
      } else {
        updated = [...prev, vehicle];
      }
      setFavoriteIds(new Set(updated.map(v => v.id)));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (id: number) => favoriteIds.has(id),
    [favoriteIds],
  );

  return { favorites, toggleFavorite, isFavorite };
}
