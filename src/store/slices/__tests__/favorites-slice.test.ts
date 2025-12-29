import { describe, it, expect } from 'vitest';
import { favoritesReducer } from '../favorites-slice';
import { fetchFavoriteOffersAction, toggleFavoriteAction } from '../../thunk/thunk';
import type { Offer } from '../../../types/offer';

const mockOffer: Offer = {
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  city: {
    name: 'Paris',
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 10,
    },
  },
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  isFavorite: true,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test.jpg',
};

describe('favoritesReducer', () => {
  it('should return initial state', () => {
    const state = favoritesReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      favoriteOffers: [],
      isLoading: false,
    });
  });

  it('should set isLoading to true when fetchFavoriteOffersAction is pending', () => {
    const state = favoritesReducer(undefined, fetchFavoriteOffersAction.pending('', undefined));
    expect(state.isLoading).toBe(true);
  });

  it('should set favoriteOffers and isLoading to false when fetchFavoriteOffersAction is fulfilled', () => {
    const offers: Offer[] = [mockOffer];
    const state = favoritesReducer(
      { favoriteOffers: [], isLoading: true },
      fetchFavoriteOffersAction.fulfilled(offers, '', undefined)
    );
    expect(state.favoriteOffers).toEqual(offers);
    expect(state.isLoading).toBe(false);
  });

  it('should set isLoading to false when fetchFavoriteOffersAction is rejected', () => {
    const state = favoritesReducer(
      { favoriteOffers: [], isLoading: true },
      fetchFavoriteOffersAction.rejected(new Error(), '', undefined)
    );
    expect(state.isLoading).toBe(false);
  });

  it('should add offer to favorites when toggleFavoriteAction is fulfilled with isFavorite true', () => {
    const initialState = {
      favoriteOffers: [],
      isLoading: false,
    };
    const state = favoritesReducer(
      initialState,
      toggleFavoriteAction.fulfilled(mockOffer, '', { offerId: '1', isFavorite: true })
    );
    expect(state.favoriteOffers).toHaveLength(1);
    expect(state.favoriteOffers[0]).toEqual(mockOffer);
  });

  it('should not add duplicate offer to favorites', () => {
    const initialState = {
      favoriteOffers: [mockOffer],
      isLoading: false,
    };
    const state = favoritesReducer(
      initialState,
      toggleFavoriteAction.fulfilled(mockOffer, '', { offerId: '1', isFavorite: true })
    );
    expect(state.favoriteOffers).toHaveLength(1);
  });

  it('should remove offer from favorites when toggleFavoriteAction is fulfilled with isFavorite false', () => {
    const initialState = {
      favoriteOffers: [mockOffer],
      isLoading: false,
    };
    const updatedOffer = { ...mockOffer, isFavorite: false };
    const state = favoritesReducer(
      initialState,
      toggleFavoriteAction.fulfilled(updatedOffer, '', { offerId: '1', isFavorite: false })
    );
    expect(state.favoriteOffers).toHaveLength(0);
  });
});

