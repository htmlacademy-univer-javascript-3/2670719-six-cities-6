import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainEmptyPage from '../main-empty-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import type { Offer } from '../../../types/offer';

const createMockStore = (authorizationStatus: string = 'NO_AUTH', city: string = 'Paris', favoriteCount: number = 0) => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    offers: {
      city,
      offers: [],
      sorting: 'Popular',
      isLoading: false,
    },
    user: {
      authorizationStatus,
      user: authorizationStatus === 'AUTH' ? { email: 'test@test.com' } : null,
    },
    favorites: {
      favoriteOffers: Array(favoriteCount).fill(null) as unknown as Offer[],
      isLoading: false,
    },
  },
});

describe('MainEmptyPage', () => {
  it('should render correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/No places to stay available/i)).toBeInTheDocument();
    expect(screen.getByText(/We could not find any property available at the moment in Paris/i)).toBeInTheDocument();
  });

  it('should display current city in message', () => {
    const store = createMockStore('NO_AUTH', 'Amsterdam');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/We could not find any property available at the moment in Amsterdam/i)).toBeInTheDocument();
  });

  it('should show sign in link when user is not authorized', () => {
    const store = createMockStore('NO_AUTH');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should show user email and favorite count when user is authorized', () => {
    const store = createMockStore('AUTH', 'Paris', 3);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

