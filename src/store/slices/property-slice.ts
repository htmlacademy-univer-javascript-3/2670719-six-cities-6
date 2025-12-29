import { createReducer } from '@reduxjs/toolkit';
import { logoutAction } from '../action';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, postReviewAction, toggleFavoriteAction, fetchFavoriteOffersAction } from '../thunk/thunk';
import type { Offer } from '../../types/offer';
import type { Review } from '../../types/review';

type PropertyState = {
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  isReviewPosting: boolean;
}

const initialState: PropertyState = {
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  isReviewPosting: false,
};

export const propertyReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchOfferAction.pending, (state, action) => {
      const requestedId = action.meta.arg;
      if (state.currentOffer?.id !== requestedId) {
        state.currentOffer = null;
      }
      state.isOfferLoading = true;
    })
    .addCase(fetchOfferAction.fulfilled, (state, action) => {
      state.currentOffer = action.payload;
      state.isOfferLoading = false;
    })
    .addCase(fetchOfferAction.rejected, (state) => {
      state.currentOffer = null;
      state.isOfferLoading = false;
    })
    .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
      state.nearbyOffers = action.payload;
    })
    .addCase(fetchReviewsAction.fulfilled, (state, action) => {
      state.reviews = action.payload;
    })
    .addCase(postReviewAction.pending, (state) => {
      state.isReviewPosting = true;
    })
    .addCase(postReviewAction.fulfilled, (state, action) => {
      state.reviews = [action.payload, ...state.reviews];
      state.isReviewPosting = false;
    })
    .addCase(postReviewAction.rejected, (state) => {
      state.isReviewPosting = false;
    })
    .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      if (state.currentOffer?.id === action.payload.id) {
        state.currentOffer = action.payload;
      }
      const nearbyIndex = state.nearbyOffers.findIndex((offer) => offer.id === action.payload.id);
      if (nearbyIndex !== -1) {
        state.nearbyOffers[nearbyIndex] = action.payload;
      }
    })
    .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
      const favoriteIds = new Set(action.payload.map((offer) => offer.id));
      if (state.currentOffer) {
        state.currentOffer = {
          ...state.currentOffer,
          isFavorite: favoriteIds.has(state.currentOffer.id),
        };
      }
      state.nearbyOffers = state.nearbyOffers.map((offer) => ({
        ...offer,
        isFavorite: favoriteIds.has(offer.id),
      }));
    })
    .addCase(logoutAction, (state) => {
      if (state.currentOffer) {
        state.currentOffer = {
          ...state.currentOffer,
          isFavorite: false,
        };
      }
      state.nearbyOffers = state.nearbyOffers.map((offer) => ({
        ...offer,
        isFavorite: false,
      }));
    });
});

