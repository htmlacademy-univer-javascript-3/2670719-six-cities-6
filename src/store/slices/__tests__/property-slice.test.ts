import { describe, it, expect } from 'vitest';
import { propertyReducer } from '../property-slice';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, postReviewAction, toggleFavoriteAction } from '../../thunk/thunk';
import type { Offer } from '../../../types/offer';
import type { Review } from '../../../types/review';

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

const mockReview: Review = {
  id: '1',
  date: '2024-01-01',
  user: {
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  comment: 'Test comment',
  rating: 5,
};

describe('propertyReducer', () => {
  it('should return initial state', () => {
    const state = propertyReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isReviewPosting: false,
    });
  });

  it('should set isOfferLoading to true when fetchOfferAction is pending', () => {
    const state = propertyReducer(undefined, fetchOfferAction.pending('', '1'));
    expect(state.isOfferLoading).toBe(true);
  });

  it('should set currentOffer and isOfferLoading to false when fetchOfferAction is fulfilled', () => {
    const state = propertyReducer(
      { currentOffer: null, nearbyOffers: [], reviews: [], isOfferLoading: true, isReviewPosting: false },
      fetchOfferAction.fulfilled(mockOffer, '', '1')
    );
    expect(state.currentOffer).toEqual(mockOffer);
    expect(state.isOfferLoading).toBe(false);
  });

  it('should set currentOffer to null and isOfferLoading to false when fetchOfferAction is rejected', () => {
    const state = propertyReducer(
      { currentOffer: mockOffer, nearbyOffers: [], reviews: [], isOfferLoading: true, isReviewPosting: false },
      fetchOfferAction.rejected(new Error(), '', '1', undefined)
    );
    expect(state.currentOffer).toBeNull();
    expect(state.isOfferLoading).toBe(false);
  });

  it('should set nearbyOffers when fetchNearbyOffersAction is fulfilled', () => {
    const nearbyOffers: Offer[] = [mockOffer];
    const state = propertyReducer(
      undefined,
      fetchNearbyOffersAction.fulfilled(nearbyOffers, '', '1')
    );
    expect(state.nearbyOffers).toEqual(nearbyOffers);
  });

  it('should set reviews when fetchReviewsAction is fulfilled', () => {
    const reviews: Review[] = [mockReview];
    const state = propertyReducer(
      undefined,
      fetchReviewsAction.fulfilled(reviews, '', '1')
    );
    expect(state.reviews).toEqual(reviews);
  });

  it('should set isReviewPosting to true when postReviewAction is pending', () => {
    const state = propertyReducer(
      undefined,
      postReviewAction.pending('', { offerId: '1', reviewData: { comment: 'test', rating: 5 } })
    );
    expect(state.isReviewPosting).toBe(true);
  });

  it('should add review and set isReviewPosting to false when postReviewAction is fulfilled', () => {
    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isReviewPosting: true,
    };
    const state = propertyReducer(
      initialState,
      postReviewAction.fulfilled(mockReview, '', { offerId: '1', reviewData: { comment: 'test', rating: 5 } })
    );
    expect(state.reviews).toEqual([mockReview]);
    expect(state.isReviewPosting).toBe(false);
  });

  it('should set isReviewPosting to false when postReviewAction is rejected', () => {
    const state = propertyReducer(
      { currentOffer: null, nearbyOffers: [], reviews: [], isOfferLoading: false, isReviewPosting: true },
      postReviewAction.rejected(new Error(), '', { offerId: '1', reviewData: { comment: 'test', rating: 5 } }, 'Error')
    );
    expect(state.isReviewPosting).toBe(false);
  });

  it('should update currentOffer when toggleFavoriteAction is fulfilled', () => {
    const initialState = {
      currentOffer: mockOffer,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isReviewPosting: false,
    };
    const updatedOffer = { ...mockOffer, isFavorite: true };
    const state = propertyReducer(
      initialState,
      toggleFavoriteAction.fulfilled(updatedOffer, '', { offerId: '1', isFavorite: true })
    );
    expect(state.currentOffer?.isFavorite).toBe(true);
  });

  it('should update nearbyOffer when toggleFavoriteAction is fulfilled', () => {
    const initialState = {
      currentOffer: null,
      nearbyOffers: [mockOffer],
      reviews: [],
      isOfferLoading: false,
      isReviewPosting: false,
    };
    const updatedOffer = { ...mockOffer, isFavorite: true };
    const state = propertyReducer(
      initialState,
      toggleFavoriteAction.fulfilled(updatedOffer, '', { offerId: '1', isFavorite: true })
    );
    expect(state.nearbyOffers[0].isFavorite).toBe(true);
  });
});

