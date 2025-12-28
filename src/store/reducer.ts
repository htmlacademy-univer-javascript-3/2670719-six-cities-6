import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSorting, requireAuthorization } from './action';
import { fetchOffersAction, checkAuthAction, loginAction, fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, postReviewAction } from './thunk';
import type { Offer } from '../types/offer';
import type { Review } from '../types/review';

type State = {
  city: string;
  offers: Offer[];
  sorting: string;
  isLoading: boolean;
  authorizationStatus: string;
  user: {
    email: string;
  } | null;
  currentOffer: Offer | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  isReviewPosting: boolean;
}

const initialState: State = {
  city: 'Paris',
  offers: [],
  sorting: 'Popular',
  isLoading: false,
  authorizationStatus: 'UNKNOWN',
  user: null,
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  isReviewPosting: false,
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(changeSorting, (state, action) => {
      state.sorting = action.payload;
    })
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(fetchOffersAction.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchOffersAction.fulfilled, (state, action) => {
      state.offers = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchOffersAction.rejected, (state) => {
      state.isLoading = false;
    })
    .addCase(checkAuthAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = { email: action.payload.email };
    })
    .addCase(checkAuthAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    })
    .addCase(loginAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = { email: action.payload.email };
    })
    .addCase(loginAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    })
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

