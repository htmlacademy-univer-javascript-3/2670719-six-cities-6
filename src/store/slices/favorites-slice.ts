import { createReducer } from '@reduxjs/toolkit';
import { logoutAction } from '../action';
import { fetchFavoriteOffersAction, toggleFavoriteAction } from '../thunk/thunk';
import type { Offer } from '../../types/offer';

type FavoritesState = {
  favoriteOffers: Offer[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  favoriteOffers: [],
  isLoading: false,
};

export const favoritesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchFavoriteOffersAction.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
      state.favoriteOffers = action.payload;
      state.isLoading = false;
    })
    .addCase(fetchFavoriteOffersAction.rejected, (state) => {
      state.isLoading = false;
    })
    .addCase(toggleFavoriteAction.fulfilled, (state, action) => {
      if (action.payload.isFavorite) {
        const exists = state.favoriteOffers.find((offer) => offer.id === action.payload.id);
        if (!exists) {
          state.favoriteOffers.push(action.payload);
        }
      } else {
        state.favoriteOffers = state.favoriteOffers.filter((offer) => offer.id !== action.payload.id);
      }
    })
    .addCase(logoutAction, (state) => {
      state.favoriteOffers = [];
    });
});

