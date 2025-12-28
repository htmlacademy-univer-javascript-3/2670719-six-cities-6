import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ReviewForm from '../review-form';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (isReviewPosting: boolean = false) => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    property: {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isReviewPosting,
    },
  },
});

describe('ReviewForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    expect(screen.getByLabelText('Your review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tell how was your stay/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should update review textarea value', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    await user.type(textarea, 'Great place to stay!');
    expect(textarea).toHaveValue('Great place to stay!');
  });

  it('should update rating when star is clicked', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const star5 = screen.getByLabelText(/perfect/i);
    await user.click(star5);
    const ratingInput = screen.getByDisplayValue('5');
    expect(ratingInput).toBeChecked();
  });

  it('should disable submit button when review is too short', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.type(textarea, 'Short');
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when review is too long', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const longText = 'a'.repeat(301);
    await user.type(textarea, longText);
    expect(submitButton).toBeDisabled();
  });

  it('should disable submit button when rating is not selected', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when rating and valid review are provided', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const star5 = screen.getByLabelText(/perfect/i);
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(star5);
    await user.type(textarea, 'a'.repeat(50));
    expect(submitButton).not.toBeDisabled();
  });

  it('should dispatch postReviewAction on form submit', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const star5 = screen.getByLabelText(/perfect/i);
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(star5);
    const reviewText = 'a'.repeat(50);
    await user.type(textarea, reviewText);
    await user.click(submitButton);
    expect(dispatchSpy).toHaveBeenCalled();
    const lastCall = dispatchSpy.mock.calls[dispatchSpy.mock.calls.length - 1][0];
    if ('type' in lastCall) {
      expect(lastCall.type).toBe('data/postReview/pending');
    }
  });

  it('should clear form after successful submit', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const star5 = screen.getByLabelText(/perfect/i);
    const textarea = screen.getByPlaceholderText(/Tell how was your stay/i);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(star5);
    const reviewText = 'a'.repeat(50);
    await user.type(textarea, reviewText);
    await user.click(submitButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(textarea).toHaveValue('');
  });

  it('should disable submit button when review is posting', () => {
    const store = createMockStore(true);
    render(
      <Provider store={store}>
        <ReviewForm offerId="1" />
      </Provider>
    );
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });
});

