import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import App from '../app';
import { offersReducer } from '../../store/slices/offers-slice';
import { userReducer } from '../../store/slices/user-slice';
import { propertyReducer } from '../../store/slices/property-slice';
import { favoritesReducer } from '../../store/slices/favorites-slice';

const createMockStore = () => configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
    favorites: favoritesReducer,
  },
});

describe('App routing', () => {
  it('should render MainPage on root route', () => {
    window.history.pushState({}, '', '/');
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText(/places to stay/i)).toBeInTheDocument();
  });

  it('should render LoginPage on /login route', () => {
    window.history.pushState({}, '', '/login');
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should render NotFoundPage on unknown route', () => {
    window.history.pushState({}, '', '/unknown-route');
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render NotFoundPage on /404 route', () => {
    window.history.pushState({}, '', '/404');
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
  });
});

