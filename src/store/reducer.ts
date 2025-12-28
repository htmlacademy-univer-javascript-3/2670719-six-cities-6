import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSorting, requireAuthorization } from './action';
import { fetchOffersAction, checkAuthAction, loginAction } from './thunk';
import type { Offer } from '../types/offer';

type State = {
  city: string;
  offers: Offer[];
  sorting: string;
  isLoading: boolean;
  authorizationStatus: string;
  user: {
    email: string;
  } | null;
}

const initialState: State = {
  city: 'Paris',
  offers: [],
  sorting: 'Popular',
  isLoading: false,
  authorizationStatus: 'UNKNOWN',
  user: null,
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
    });
});

