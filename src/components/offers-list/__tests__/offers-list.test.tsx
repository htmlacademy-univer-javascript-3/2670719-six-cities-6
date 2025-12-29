import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import OffersList from '../offers-list';
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

const createMockStore = () => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
});

describe('OffersList', () => {
  it('should render all offers', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OffersList offers={[mockOffer1, mockOffer2]} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Test Offer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Offer 2')).toBeInTheDocument();
  });

  it('should call onCardMouseEnter when mouse enters card', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OffersList
            offers={[mockOffer1]}
            onCardMouseEnter={handleMouseEnter}
            onCardMouseLeave={handleMouseLeave}
          />
        </BrowserRouter>
      </Provider>
    );
    const card = screen.getByText('Test Offer 1').closest('article');
    if (card) {
      await user.hover(card);
      expect(handleMouseEnter).toHaveBeenCalledWith('1');
    }
  });

  it('should call onCardMouseLeave when mouse leaves card', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OffersList
            offers={[mockOffer1]}
            onCardMouseEnter={handleMouseEnter}
            onCardMouseLeave={handleMouseLeave}
          />
        </BrowserRouter>
      </Provider>
    );
    const card = screen.getByText('Test Offer 1').closest('article');
    if (card) {
      await user.hover(card);
      await user.unhover(card);
      expect(handleMouseLeave).toHaveBeenCalled();
    }
  });

  it('should render empty list', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <OffersList offers={[]} />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.queryByText('Test Offer 1')).not.toBeInTheDocument();
  });
});

