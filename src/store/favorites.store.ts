import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (parkId: string) => void;
  isFavorite: (parkId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (parkId) => {
        const { favoriteIds } = get();
        set({
          favoriteIds: favoriteIds.includes(parkId)
            ? favoriteIds.filter((id) => id !== parkId)
            : [...favoriteIds, parkId],
        });
      },
      isFavorite: (parkId) => get().favoriteIds.includes(parkId),
    }),
    { name: 'smart-parks-web-favorites' },
  ),
);
