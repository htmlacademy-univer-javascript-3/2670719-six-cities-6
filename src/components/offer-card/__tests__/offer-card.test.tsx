import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OfferCard from '../offer-card';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';
import type { Offer } from '../../../types/offer';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

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
  isPremium: false,
  rating: 4.5,
  previewImage: 'test.jpg',
};

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
  },
});

describe('OfferCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = createMockStore();
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard
            offer={mockOffer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Test Offer')).toBeInTheDocument();
    expect(screen.getByText('€100')).toBeInTheDocument();
  });

  it('should show premium badge when offer is premium', () => {
    const premiumOffer = { ...mockOffer, isPremium: true };
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={premiumOffer} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('should call onMouseEnter when mouse enters card', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard
            offer={mockOffer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </BrowserRouter>
      </Provider>
    );
    const card = screen.getByText('Test Offer').closest('article');
    if (card) {
      await user.hover(card);
      expect(handleMouseEnter).toHaveBeenCalledWith('1');
    }
  });

  it('should call onMouseLeave when mouse leaves card', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard
            offer={mockOffer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </BrowserRouter>
      </Provider>
    );
    const card = screen.getByText('Test Offer').closest('article');
    if (card) {
      await user.hover(card);
      await user.unhover(card);
      expect(handleMouseLeave).toHaveBeenCalled();
    }
  });

  it('should dispatch toggleFavoriteAction when favorite button is clicked and user is authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore('AUTH');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );
    const favoriteButton = screen.getByRole('button', { name: /bookmarks/i });
    await user.click(favoriteButton);
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0];
    if ('type' in lastCall) {
      expect(lastCall.type).toBe('offers/toggleFavorite/pending');
    }
  });

  it('should navigate to login when favorite button is clicked and user is not authorized', async () => {
    const user = userEvent.setup();
    const store = createMockStore('NO_AUTH');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={mockOffer} />
        </BrowserRouter>
      </Provider>
    );
    const favoriteButton = screen.getByRole('button', { name: /bookmarks/i });
    await user.click(favoriteButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should show active favorite button when offer is favorite', () => {
    const favoriteOffer = { ...mockOffer, isFavorite: true };
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OfferCard offer={favoriteOffer} />
        </BrowserRouter>
      </Provider>
    );
    const favoriteButton = screen.getByRole('button', { name: /In bookmarks/i });
    expect(favoriteButton).toHaveClass('place-card__bookmark-button--active');
  });
});

