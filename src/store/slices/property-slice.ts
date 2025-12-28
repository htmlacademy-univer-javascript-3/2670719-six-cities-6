import { createReducer } from '@reduxjs/toolkit';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, postReviewAction } from '../thunk';
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
    .addCase(fetchOfferAction.pending, (state) => {
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
    });
});

