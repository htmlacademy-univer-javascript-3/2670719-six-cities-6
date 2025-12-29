import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CitiesList from '../cities-list';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (currentCity: string = 'Paris') => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    offers: {
      city: currentCity,
      offers: [],
      sorting: 'Popular',
      isLoading: false,
    },
  },
});

describe('CitiesList', () => {
  it('should render all cities', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <CitiesList />
      </Provider>
    );
    expect(screen.getByText('Paris')).toBeInTheDocument();
    expect(screen.getByText('Cologne')).toBeInTheDocument();
    expect(screen.getByText('Brussels')).toBeInTheDocument();
    expect(screen.getByText('Amsterdam')).toBeInTheDocument();
    expect(screen.getByText('Hamburg')).toBeInTheDocument();
    expect(screen.getByText('Dusseldorf')).toBeInTheDocument();
  });

  it('should highlight current city', () => {
    const store = createMockStore('Amsterdam');
    render(
      <Provider store={store}>
        <CitiesList />
      </Provider>
    );
    const amsterdamLink = screen.getByText('Amsterdam').closest('a');
    expect(amsterdamLink).toHaveClass('tabs__item--active');
  });

  it('should dispatch changeCity action on city click', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <CitiesList />
      </Provider>
    );
    const cologneLink = screen.getByText('Cologne');
    await user.click(cologneLink);
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0];
    if ('type' in lastCall) {
      expect(lastCall.type).toBe('city/changeCity');
      expect('payload' in lastCall && lastCall.payload).toBe('Cologne');
    }
  });
});

