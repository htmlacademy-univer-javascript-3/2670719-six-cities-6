import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { sortOffers } from '../utils/sorting';

export const selectCity = (state: RootState) => state.offers.city;
export const selectSorting = (state: RootState) => state.offers.sorting;
export const selectAllOffers = (state: RootState) => state.offers.offers;
export const selectIsLoading = (state: RootState) => state.offers.isLoading;

export const selectAuthorizationStatus = (state: RootState) => state.user.authorizationStatus;
export const selectUser = (state: RootState) => state.user.user;

export const selectCurrentOffer = (state: RootState) => state.property.currentOffer;
export const selectNearbyOffers = (state: RootState) => state.property.nearbyOffers;
export const selectReviews = (state: RootState) => state.property.reviews;
export const selectIsOfferLoading = (state: RootState) => state.property.isOfferLoading;
export const selectIsReviewPosting = (state: RootState) => state.property.isReviewPosting;

export const selectFilteredOffers = createSelector(
  [selectAllOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const selectSortedOffers = createSelector(
  [selectFilteredOffers, selectSorting],
  (filteredOffers, sorting) => sortOffers(filteredOffers, sorting)
);

export const selectFavoriteOffers = createSelector(
  [selectAllOffers],
  (offers) => offers.filter((offer) => offer.isFavorite)
);

export const selectCityFromOffers = createSelector(
  [selectSortedOffers, selectFilteredOffers, selectCity],
  (sortedOffers, filteredOffers, city) =>
    sortedOffers[0]?.city || filteredOffers[0]?.city || {
      name: city,
      location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 },
    }
);

