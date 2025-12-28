import { createReducer } from '@reduxjs/toolkit';
import { changeCity, fillOffers, changeSorting } from './action';
import type { Offer } from '../mocks/offers';

type State = {
  city: string;
  offers: Offer[];
  sorting: string;
}

const initialState: State = {
  city: 'Paris',
  offers: [],
  sorting: 'Popular',
};

export const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
    })
    .addCase(fillOffers, (state, action) => {
      state.offers = action.payload;
    })
    .addCase(changeSorting, (state, action) => {
      state.sorting = action.payload;
    });
});

