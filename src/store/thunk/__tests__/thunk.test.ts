import { describe, it, expect } from 'vitest';
import { fetchOffersAction, fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, postReviewAction, toggleFavoriteAction, fetchFavoriteOffersAction } from '../thunk';

describe('Async thunks', () => {
  it('should have correct action types', () => {
    expect(fetchOffersAction.typePrefix).toBe('data/fetchOffers');
    expect(fetchOfferAction.typePrefix).toBe('data/fetchOffer');
    expect(fetchNearbyOffersAction.typePrefix).toBe('data/fetchNearbyOffers');
    expect(fetchReviewsAction.typePrefix).toBe('data/fetchReviews');
    expect(postReviewAction.typePrefix).toBe('data/postReview');
    expect(toggleFavoriteAction.typePrefix).toBe('offers/toggleFavorite');
    expect(fetchFavoriteOffersAction.typePrefix).toBe('offers/fetchFavorites');
  });

  it('should have pending actions', () => {
    expect(fetchOffersAction.pending.type).toBe('data/fetchOffers/pending');
    expect(fetchOfferAction.pending.type).toBe('data/fetchOffer/pending');
    expect(fetchNearbyOffersAction.pending.type).toBe('data/fetchNearbyOffers/pending');
    expect(fetchReviewsAction.pending.type).toBe('data/fetchReviews/pending');
    expect(postReviewAction.pending.type).toBe('data/postReview/pending');
    expect(toggleFavoriteAction.pending.type).toBe('offers/toggleFavorite/pending');
    expect(fetchFavoriteOffersAction.pending.type).toBe('offers/fetchFavorites/pending');
  });

  it('should have fulfilled actions', () => {
    expect(fetchOffersAction.fulfilled.type).toBe('data/fetchOffers/fulfilled');
    expect(fetchOfferAction.fulfilled.type).toBe('data/fetchOffer/fulfilled');
    expect(fetchNearbyOffersAction.fulfilled.type).toBe('data/fetchNearbyOffers/fulfilled');
    expect(fetchReviewsAction.fulfilled.type).toBe('data/fetchReviews/fulfilled');
    expect(postReviewAction.fulfilled.type).toBe('data/postReview/fulfilled');
    expect(toggleFavoriteAction.fulfilled.type).toBe('offers/toggleFavorite/fulfilled');
    expect(fetchFavoriteOffersAction.fulfilled.type).toBe('offers/fetchFavorites/fulfilled');
  });

  it('should have rejected actions', () => {
    expect(fetchOffersAction.rejected.type).toBe('data/fetchOffers/rejected');
    expect(fetchOfferAction.rejected.type).toBe('data/fetchOffer/rejected');
    expect(fetchNearbyOffersAction.rejected.type).toBe('data/fetchNearbyOffers/rejected');
    expect(fetchReviewsAction.rejected.type).toBe('data/fetchReviews/rejected');
    expect(postReviewAction.rejected.type).toBe('data/postReview/rejected');
    expect(toggleFavoriteAction.rejected.type).toBe('offers/toggleFavorite/rejected');
    expect(fetchFavoriteOffersAction.rejected.type).toBe('offers/fetchFavorites/rejected');
  });
});
