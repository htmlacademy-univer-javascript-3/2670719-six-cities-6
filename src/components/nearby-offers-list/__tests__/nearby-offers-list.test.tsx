import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import NearbyOffersList from '../nearby-offers-list';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import type { Offer } from '../../../types/offer';

const mockOffer1: Offer = {
  id: '1',
  title: 'Nearby Offer 1',
  type: 'apartment',
  price: 100,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test1.jpg',
};

const mockOffer2: Offer = {
  id: '2',
  title: 'Nearby Offer 2',
  type: 'house',
  price: 200,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  isFavorite: true,
  isPremium: true,
  rating: 5,
  previewImage: 'test2.jpg',
};

const createMockStore = () => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
});

describe('NearbyOffersList', () => {
  it('should render all nearby offers', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NearbyOffersList offers={[mockOffer1, mockOffer2]} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Nearby Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Nearby Offer 2')).toBeInTheDocument();
  });

  it('should render empty list', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <NearbyOffersList offers={[]} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.queryByText('Nearby Offer 1')).not.toBeInTheDocument();
  });
});

