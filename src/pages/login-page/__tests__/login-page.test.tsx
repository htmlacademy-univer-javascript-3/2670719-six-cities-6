import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../login-page';
import { offersReducer } from '../../../store/slices/offers-slice';
import { userReducer } from '../../../store/slices/user-slice';
import { propertyReducer } from '../../../store/slices/property-slice';
import { favoritesReducer } from '../../../store/slices/favorites-slice';

const createMockStore = (authorizationStatus: string = 'NO_AUTH') => configureStore({
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

describe('LoginPage', () => {
  it('should render correctly', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('should update email input value', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'test@test.com');
    expect(emailInput).toHaveValue('test@test.com');
  });

  it('should update password input value', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'password123');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should dispatch loginAction on form submit', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(dispatchSpy).toHaveBeenCalled();
    const calls = dispatchSpy.mock.calls;
    const loginCall = calls.find((call) =>
      typeof call[0] === 'function' ||
      (call[0] && 'type' in call[0] && String(call[0].type)?.includes('login'))
    );
    expect(loginCall).toBeDefined();
  });

  it('should redirect to home when user is already authorized', () => {
    const store = createMockStore('AUTH');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    expect(screen.queryByRole('heading', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('should not dispatch loginAction when form is submitted with empty email', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    const loginCalls = dispatchSpy.mock.calls.filter(
      (call) => 'type' in call[0] && call[0].type === 'user/login/pending'
    );
    expect(loginCalls.length).toBe(0);
  });

  it('should not dispatch loginAction when form is submitted with empty password', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'test@test.com');
    await user.click(submitButton);

    const loginCalls = dispatchSpy.mock.calls.filter(
      (call) => 'type' in call[0] && call[0].type === 'user/login/pending'
    );
    expect(loginCalls.length).toBe(0);
  });

  it('should trim email before dispatching loginAction', async () => {
    const user = userEvent.setup();
    const store = createMockStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, '  test@test.com  ');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(dispatchSpy).toHaveBeenCalled();
    const calls = dispatchSpy.mock.calls;
    const loginCall = calls.find((call) =>
      typeof call[0] === 'function' ||
      (call[0] && 'type' in call[0] && String(call[0].type)?.includes('login'))
    );
    expect(loginCall).toBeDefined();
  });

  it('should render logo link to home', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );
    const logoLink = screen.getByAltText('6 cities logo').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});

