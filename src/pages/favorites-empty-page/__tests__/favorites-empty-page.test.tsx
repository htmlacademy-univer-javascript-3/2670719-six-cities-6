import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FavoritesEmptyPage from '../favorites-empty-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (authorizationStatus: string = 'AUTH') => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    user: {
      authorizationStatus,
      user: authorizationStatus === 'AUTH' ? { email: 'test@test.com' } : null,
    },
    favorites: {
      favoriteOffers: [],
      isLoading: false,
    },
  },
});

describe('FavoritesEmptyPage', () => {
  it('should render correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    expect(screen.getByText(/Save properties to narrow down search or plan your future trips/i)).toBeInTheDocument();
  });

  it('should render header with logo', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    const logo = container.querySelector('.header__logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt', '6 cities logo');
  });

  it('should render footer with logo', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesEmptyPage />
        </BrowserRouter>
      </Provider>
    );
    const footerLogos = screen.getAllByAltText('6 cities logo');
    expect(footerLogos.length).toBeGreaterThan(0);
  });
});

