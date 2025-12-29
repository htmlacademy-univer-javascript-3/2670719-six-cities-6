import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, type Middleware, type AnyAction } from '@reduxjs/toolkit';
import FavoritesPage from '../favorites-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import { fetchFavoriteOffersAction } from '../../../store/thunk/thunk';
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
  isFavorite: true,
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

const mockOffer3: Offer = {
  id: '3',
  title: 'Test Offer 3',
  type: 'room',
  price: 150,
  city: {
    name: 'Cologne',
    location: { latitude: 50.9375, longitude: 6.9603, zoom: 10 },
  },
  location: { latitude: 50.9375, longitude: 6.9603, zoom: 10 },
  isFavorite: true,
  isPremium: false,
  rating: 4,
  previewImage: 'test3.jpg',
};

const createMockStore = (
  authorizationStatus: string = 'AUTH',
  favoriteOffers: Offer[] = [],
  isLoading: boolean = false
) => {
  let storeRef: ReturnType<typeof configureStore> | null = null;

  const mockMiddleware: Middleware = () => (next) => (action: AnyAction) => {
    if (action && typeof action === 'object' && 'type' in action) {
      const actionType = String((action as { type: unknown }).type);
      if (actionType === 'offers/fetchFavorites/pending' && storeRef) {
        setTimeout(() => {
          storeRef!.dispatch(fetchFavoriteOffersAction.fulfilled(favoriteOffers, '', undefined));
        }, 0);
      }
    }
    return next(action);
  };

  const store = configureStore({
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
        favoriteOffers,
        isLoading,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {},
        },
      }).concat(mockMiddleware),
  });

  storeRef = store as ReturnType<typeof configureStore>;
  return store;
};

describe('FavoritesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading spinner when loading', () => {
    const store = createMockStore('AUTH', [], true);
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    const spinner = container.querySelector('div[style*="border"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should render empty state when no favorites', async () => {
    const store = createMockStore('AUTH', [], false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Nothing yet saved.')).toBeInTheDocument();
    });
    expect(screen.getByText(/Save properties to narrow down search or plan your future trips/i)).toBeInTheDocument();
  });

  it('should render favorites grouped by city', async () => {
    const store = createMockStore('AUTH', [mockOffer1, mockOffer2, mockOffer3], false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Saved listing')).toBeInTheDocument();
    });
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 3')).toBeInTheDocument();
  });

  it('should display user email and favorite count', async () => {
    const store = createMockStore('AUTH', [mockOffer1, mockOffer2], false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('test@test.com')).toBeInTheDocument();
    });
    const favoriteCount = screen.getByText('2');
    expect(favoriteCount).toBeInTheDocument();
  });

  it('should dispatch toggleFavoriteAction when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore('AUTH', [mockOffer1], false);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    });
    const favoriteButton = screen.getAllByRole('button', { name: /In bookmarks/i })[0];
    await user.click(favoriteButton);
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0] as { type?: string };
    if (lastCall && 'type' in lastCall) {
      expect(lastCall.type).toBe('offers/toggleFavorite/pending');
    }
  });

  it('should dispatch fetchFavoriteOffersAction when authorized', () => {
    const store = createMockStore('AUTH', [], false);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should not dispatch fetchFavoriteOffersAction when not authorized', () => {
    const store = createMockStore('NO_AUTH', [], false);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    const fetchCalls = dispatchSpy.mock.calls.filter(
      (call) => call[0] && typeof call[0] === 'object' && 'type' in call[0] && (call[0] as { type: string }).type === 'offers/fetchFavorites/pending'
    );
    expect(fetchCalls.length).toBe(0);
  });

  it('should render premium badge for premium offers', async () => {
    const store = createMockStore('AUTH', [mockOffer2], false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });
  });

  it('should render links to offer pages', async () => {
    const store = createMockStore('AUTH', [mockOffer1], false);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <FavoritesPage />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    });
    const offerLink = screen.getByText('Test Offer 1').closest('a');
    expect(offerLink).toHaveAttribute('href', '/offer/1');
  });
});

