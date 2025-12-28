import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SortOptions from '../sort-options';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (currentSorting: string = 'Popular') => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    offers: {
      city: 'Paris',
      offers: [],
      sorting: currentSorting,
      isLoading: false,
    },
  },
});

describe('SortOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render current sorting', () => {
    const store = createMockStore('Price: low to high');
    render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = screen.getByRole('button', { name: /sort by/i }).parentElement?.querySelector('.places__sorting-type');
    expect(sortingType).toHaveTextContent('Price: low to high');
  });

  it('should toggle dropdown on click', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = container.querySelector('.places__sorting-type');
    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
    if (sortingType) {
      await user.click(sortingType);
      expect(optionsList).toHaveClass('places__options--opened');
    }
  });

  it('should dispatch changeSorting and close dropdown on option click', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const { container } = render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = container.querySelector('.places__sorting-type');
    if (sortingType) {
      await user.click(sortingType);
    }
    const priceOptions = screen.getAllByText('Price: low to high');
    const priceOption = priceOptions.find((el) => el.tagName === 'LI');
    if (priceOption) {
      await user.click(priceOption);
    }
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0];
    if ('type' in lastCall) {
      expect(lastCall.type).toBe('sorting/changeSorting');
      expect('payload' in lastCall && lastCall.payload).toBe('Price: low to high');
    }
    const optionsList = container.querySelector('.places__options');
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should highlight active option', async () => {
    const user = userEvent.setup();
    const store = createMockStore('Top rated first');
    const { container } = render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = container.querySelector('.places__sorting-type');
    if (sortingType) {
      await user.click(sortingType);
    }
    const activeOptions = screen.getAllByText('Top rated first');
    const activeOption = activeOptions.find((el) => el.tagName === 'LI');
    expect(activeOption).toHaveClass('places__option--active');
  });

  it('should close dropdown when clicking on the same option', async () => {
    const user = userEvent.setup();
    const store = createMockStore('Popular');
    const { container } = render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = container.querySelector('.places__sorting-type');
    if (sortingType) {
      await user.click(sortingType);
    }
    const optionsList = container.querySelector('.places__options');
    expect(optionsList).toHaveClass('places__options--opened');

    const popularOptions = screen.getAllByText('Popular');
    const popularOption = popularOptions.find((el) => el.tagName === 'LI');
    if (popularOption) {
      await user.click(popularOption);
    }
    expect(optionsList).not.toHaveClass('places__options--opened');
  });

  it('should toggle dropdown multiple times', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <SortOptions />
      </Provider>
    );
    const sortingType = container.querySelector('.places__sorting-type');
    const optionsList = container.querySelector('.places__options');

    if (sortingType) {
      await user.click(sortingType);
      expect(optionsList).toHaveClass('places__options--opened');

      await user.click(sortingType);
      expect(optionsList).not.toHaveClass('places__options--opened');

      await user.click(sortingType);
      expect(optionsList).toHaveClass('places__options--opened');
    }
  });
});

