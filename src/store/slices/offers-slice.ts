import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSorting } from '../action';
import { fetchOffersAction, toggleFavoriteAction } from '../thunk';
import { DEFAULT_CITY, DEFAULT_SORTING } from '../../constants/constants';
import type { Offer } from '../../types/offer';

type OffersState = {
  city: string;
  offers: Offer[];
  sorting: string;
  isLoading: boolean;
}

const initialState: OffersState = {
  city: DEFAULT_CITY,
  offers: [],
  sorting: DEFAULT_SORTING,
  isLoading: false,
};

export const offersReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(changeSorting, (state, action) => {
      state.sorting = action.payload;
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
    .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      const index = state.offers.findIndex((offer) => offer.id === action.payload.id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
    });
});

