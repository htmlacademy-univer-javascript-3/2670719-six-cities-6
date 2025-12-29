import { describe, it, expect } from 'vitest';
import { offersReducer } from '../offers-slice';
import { changeCity, changeSorting } from '../../action';
import { fetchOffersAction, toggleFavoriteAction } from '../../thunk/thunk';
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
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test.jpg',
};

describe('offersReducer', () => {
  it('should return initial state', () => {
    const state = offersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      city: 'Paris',
      offers: [],
      sorting: 'Popular',
      isLoading: false,
    });
  });

  it('should change city', () => {
    const state = offersReducer(undefined, changeCity('Amsterdam'));
    expect(state.city).toBe('Amsterdam');
  });

  it('should change sorting', () => {
    const state = offersReducer(undefined, changeSorting('Price: low to high'));
    expect(state.sorting).toBe('Price: low to high');
  });

  it('should set isLoading to true when fetchOffersAction is pending', () => {
    const state = offersReducer(undefined, fetchOffersAction.pending('', undefined));
    expect(state.isLoading).toBe(true);
  });

  it('should set offers and isLoading to false when fetchOffersAction is fulfilled', () => {
    const offers: Offer[] = [mockOffer];
    const state = offersReducer(
      { city: 'Paris', offers: [], sorting: 'Popular', isLoading: true },
      fetchOffersAction.fulfilled(offers, '', undefined)
    );
    expect(state.offers).toEqual(offers);
    expect(state.isLoading).toBe(false);
  });

  it('should set isLoading to false when fetchOffersAction is rejected', () => {
    const state = offersReducer(
      { city: 'Paris', offers: [], sorting: 'Popular', isLoading: true },
      fetchOffersAction.rejected(new Error(), '', undefined)
    );
    expect(state.isLoading).toBe(false);
  });

  it('should update offer when toggleFavoriteAction is fulfilled', () => {
    const initialState = {
      city: 'Paris',
      offers: [mockOffer],
      sorting: 'Popular',
      isLoading: false,
    };
    const updatedOffer = { ...mockOffer, isFavorite: true };
    const state = offersReducer(
      initialState,
      toggleFavoriteAction.fulfilled(updatedOffer, '', { offerId: '1', isFavorite: true })
    );
    expect(state.offers[0].isFavorite).toBe(true);
  });
});

