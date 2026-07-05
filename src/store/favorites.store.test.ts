import { beforeEach, describe, it, expect } from 'vitest';
import { useFavoritesStore } from './favorites.store';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favoriteIds: [] });
    localStorage.clear();
  });

  it('starts with no favorites', () => {
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(false);
  });

  it('adds a park id on toggle when not already favorited', () => {
    useFavoritesStore.getState().toggleFavorite('park-1');
    expect(useFavoritesStore.getState().favoriteIds).toEqual(['park-1']);
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(true);
  });

  it('removes a park id on toggle when already favorited', () => {
    useFavoritesStore.getState().toggleFavorite('park-1');
    useFavoritesStore.getState().toggleFavorite('park-1');
    expect(useFavoritesStore.getState().favoriteIds).toEqual([]);
    expect(useFavoritesStore.getState().isFavorite('park-1')).toBe(false);
  });
});
