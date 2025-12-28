import { createReducer } from '@reduxjs/toolkit';
import { changeCity, changeSorting } from '../action';
import { fetchOffersAction } from '../thunk';
import type { Offer } from '../../types/offer';

type OffersState = {
  city: string;
  offers: Offer[];
  sorting: string;
  isLoading: boolean;
}

const initialState: OffersState = {
  city: 'Paris',
  offers: [],
  sorting: 'Popular',
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
    });
});

