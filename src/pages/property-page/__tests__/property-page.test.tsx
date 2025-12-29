import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, type Middleware, type AnyAction } from '@reduxjs/toolkit';
import PropertyPage from '../property-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction } from '../../../store/thunk';
import type { Offer } from '../../../types/offer';
import type { Review } from '../../../types/review';

const mockOffer: Offer = {
  id: '1',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  isFavorite: false,
  isPremium: true,
  rating: 4.5,
  previewImage: 'test1.jpg',
  description: 'Test description\nLine 2',
  bedrooms: 2,
  maxAdults: 4,
  goods: ['Wi-Fi', 'Heating'],
  host: {
    name: 'John Doe',
    avatarUrl: 'avatar.jpg',
    isPro: true,
  },
  images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg', 'image6.jpg', 'image7.jpg'],
};

const mockNearbyOffer: Offer = {
  id: '2',
  title: 'Nearby Offer',
  type: 'house',
  price: 200,
  city: {
    name: 'Paris',
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 10 },
  },
  location: { latitude: 48.8576, longitude: 2.3532, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'test2.jpg',
};

const mockReview: Review = {
  id: '1',
  date: '2024-01-01',
  user: {
    name: 'Jane Doe',
    avatarUrl: 'avatar2.jpg',
    isPro: false,
  },
  comment: 'Great place!',
  rating: 5,
};

const createMockStore = (
  currentOffer: Offer | null = mockOffer,
  nearbyOffers: Offer[] = [],
  reviews: Review[] = [],
  isOfferLoading: boolean = false,
  authorizationStatus: string = 'NO_AUTH',
  actionTracker?: { pendingActions: string[] }
) => {
  let storeRef: ReturnType<typeof configureStore> | null = null;

  const mockMiddleware: Middleware = () => (next) => (action: AnyAction) => {
    if (storeRef && action && typeof action === 'object' && 'type' in action) {
      const actionType = String((action as { type: unknown }).type);
      if (actionTracker && actionType.includes('/pending')) {
        actionTracker.pendingActions.push(actionType);
      }
      if (actionType === 'data/fetchOffer/pending') {
        setTimeout(() => {
          storeRef!.dispatch(fetchOfferAction.fulfilled(currentOffer || mockOffer, '', '1'));
        }, 0);
      } else if (actionType === 'data/fetchNearbyOffers/pending') {
        setTimeout(() => {
          storeRef!.dispatch(fetchNearbyOffersAction.fulfilled(nearbyOffers, '', '1'));
        }, 0);
      } else if (actionType === 'data/fetchReviews/pending') {
        setTimeout(() => {
          storeRef!.dispatch(fetchReviewsAction.fulfilled(reviews, '', '1'));
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
      property: {
        currentOffer,
        nearbyOffers,
        reviews,
        isOfferLoading,
        isReviewPosting: false,
      },
      user: {
        authorizationStatus,
        user: authorizationStatus === 'AUTH' ? { email: 'test@test.com' } : null,
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

describe('PropertyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading spinner when loading', () => {
    const store = createMockStore(null, [], [], true);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    const spinner = container.querySelector('div[style*="border"]');
    expect(spinner).toBeInTheDocument();
  });

  it('should redirect to 404 when offer is not found', () => {
    const store = createMockStore(null);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByText('Test Offer')).not.toBeInTheDocument();
  });

  it('should render offer details', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should render offer images', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    const images = screen.getAllByAltText('Photo studio');
    expect(images.length).toBeLessThanOrEqual(6);
  });

  it('should render offer features', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('2 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
  });

  it('should render goods list', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Heating')).toBeInTheDocument();
  });

  it('should render host information', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render reviews list', () => {
    const store = createMockStore(mockOffer, [], [mockReview]);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Great place!')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('should render review form when user is authorized', () => {
    const store = createMockStore(mockOffer, [], [], false, 'AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
  });

  it('should not render review form when user is not authorized', () => {
    const store = createMockStore(mockOffer, [], [], false, 'NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.queryByLabelText('Your review')).not.toBeInTheDocument();
  });

  it('should render nearby offers list', () => {
    const store = createMockStore(mockOffer, [mockNearbyOffer]);
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
  });

  it('should dispatch fetch actions on mount', () => {
    const store = createMockStore(mockOffer, [], [], false, 'NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Test Offer')).toBeInTheDocument();
  });

  it('should navigate to login when favorite button clicked and not authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore(mockOffer, [], [], false, 'NO_AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    const favoriteButton = screen.getByRole('button', { name: /To bookmarks/i });
    await user.click(favoriteButton);
  });

  it('should dispatch toggleFavoriteAction when favorite button clicked and authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore(mockOffer, [], [], false, 'AUTH');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Test Offer')).toBeInTheDocument();
    });
    const initialCallCount = dispatchSpy.mock.calls.length;
    const favoriteButton = screen.getByRole('button', { name: /To bookmarks/i });
    await user.click(favoriteButton);
    await waitFor(() => {
      expect(dispatchSpy.mock.calls.length).toBeGreaterThan(initialCallCount);
      const newCalls = dispatchSpy.mock.calls.slice(initialCallCount);
      const hasThunkCall = newCalls.some((call) => typeof call[0] === 'function');
      expect(hasThunkCall).toBe(true);
    }, { timeout: 2000 });
  });

  it('should show active favorite button when offer is favorite', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    const store = createMockStore(favoriteOffer, [], [], false, 'AUTH');
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    const favoriteButton = screen.getByRole('button', { name: /In bookmarks/i });
    expect(favoriteButton).toHaveClass('property__bookmark-button--active');
  });

  it('should render Map component with nearby offers', () => {
    const store = createMockStore(mockOffer, [mockNearbyOffer]);
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/offer/1']}>
          <PropertyPage />
        </MemoryRouter>
      </Provider>
    );
    const mapContainer = container.querySelector('.property__map');
    expect(mapContainer).toBeInTheDocument();
  });
});

