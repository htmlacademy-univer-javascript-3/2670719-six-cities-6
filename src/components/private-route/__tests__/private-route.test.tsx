import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from '../private-route';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (authorizationStatus: string) => configureStore({
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

describe('PrivateRoute', () => {
  it('should render children when user is authorized', () => {
    const store = createMockStore('AUTH');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authorized', () => {
    const store = createMockStore('NO_AUTH');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </BrowserRouter>
      </Provider>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should redirect to login when authorization status is UNKNOWN', () => {
    const store = createMockStore('UNKNOWN');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </BrowserRouter>
      </Provider>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

