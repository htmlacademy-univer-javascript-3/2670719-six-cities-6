import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MainPage from '../main-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import type { Offer } from '../../../types/offer';

const mockOffer1: Offer = {
  id: '1',
  title: 'Test Offer 1',
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
  title: 'Test Offer 2',
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

const createMockStore = (
  isLoading: boolean = false,
  offers: Offer[] = [],
  city: string = 'Paris',
  authorizationStatus: string = 'NO_AUTH',
  favoriteOffers: Offer[] = []
) => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    offers: {
      city,
      offers,
      sorting: 'Popular',
      isLoading,
    },
    user: {
      authorizationStatus,
      user: authorizationStatus === 'AUTH' ? { email: 'test@test.com' } : null,
    },
    favorites: {
      favoriteOffers,
      isLoading: false,
    },
  },
});

describe('MainPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading spinner when loading', () => {
    const store = createMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    const spinner = container.querySelector('div[style*="border"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should render MainEmptyPage when no offers', () => {
    const store = createMockStore(false, []);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/No places to stay available/i)).toBeInTheDocument();
  });

  it('should render offers list when offers are available', () => {
    const store = createMockStore(false, [mockOffer1, mockOffer2]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument();
    expect(screen.getByText(/2 places to stay in Paris/i)).toBeInTheDocument();
  });

  it('should show sign in link when user is not authorized', () => {
    const store = createMockStore(false, [mockOffer1], 'Paris', 'NO_AUTH');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should show user email and favorite count when user is authorized', () => {
    const store = createMockStore(false, [mockOffer1], 'Paris', 'AUTH', [mockOffer2]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render CitiesList component', () => {
    const store = createMockStore(false, [mockOffer1]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
  });

  it('should render SortOptions component', () => {
    const store = createMockStore(false, [mockOffer1]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('should handle card mouse enter and leave events', async () => {
    const user = userEvent.setup();
    const store = createMockStore(false, [mockOffer1]);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    const card = screen.getByText('Test Offer 1').closest('article');
    if (card) {
      await user.hover(card);
      await user.unhover(card);
    }
    expect(card).toBeInTheDocument();
  });

  it('should render Map component with offers', () => {
    const store = createMockStore(false, [mockOffer1, mockOffer2]);
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MainPage />
        </BrowserRouter>
      </Provider>
    );
    const mapContainer = container.querySelector('.cities__map');
    expect(mapContainer).toBeInTheDocument();
  });
});

