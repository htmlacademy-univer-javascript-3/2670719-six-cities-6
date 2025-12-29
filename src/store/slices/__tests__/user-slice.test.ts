import { describe, it, expect } from 'vitest';
import { userReducer } from '../user-slice';
import { requireAuthorization, logoutAction } from '../../action';
import { checkAuthAction, loginAction } from '../../thunk/thunk';
import type { AuthInfo } from '../../../types/auth';

const mockAuthInfo: AuthInfo = {
  email: 'test@test.com',
  token: 'test-token',
};

describe('userReducer', () => {
  it('should return initial state', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      authorizationStatus: 'UNKNOWN',
      user: null,
    });
  });

  it('should change authorization status', () => {
    const state = userReducer(undefined, requireAuthorization('AUTH'));
    expect(state.authorizationStatus).toBe('AUTH');
  });

  it('should set AUTH status and user when checkAuthAction is fulfilled', () => {
    const state = userReducer(
      undefined,
      checkAuthAction.fulfilled(mockAuthInfo, '', undefined)
    );
    expect(state.authorizationStatus).toBe('AUTH');
    expect(state.user).toEqual({ email: 'test@test.com' });
  });

  it('should set NO_AUTH status and null user when checkAuthAction is rejected', () => {
    const state = userReducer(
      { authorizationStatus: 'UNKNOWN', user: null },
      checkAuthAction.rejected(new Error(), '', undefined, undefined)
    );
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
  });

  it('should set AUTH status and user when loginAction is fulfilled', () => {
    const state = userReducer(
      undefined,
      loginAction.fulfilled(mockAuthInfo, '', { email: 'test@test.com', password: 'password' })
    );
    expect(state.authorizationStatus).toBe('AUTH');
    expect(state.user).toEqual({ email: 'test@test.com' });
  });

  it('should set NO_AUTH status and null user when loginAction is rejected', () => {
    const state = userReducer(
      { authorizationStatus: 'AUTH', user: { email: 'test@test.com' } },
      loginAction.rejected(new Error(), '', { email: 'test@test.com', password: 'password' }, 'error')
    );
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
  });

  it('should logout user and remove token from localStorage', () => {
    localStorage.setItem('six-cities-token', 'test-token');
    const state = userReducer(
      { authorizationStatus: 'AUTH', user: { email: 'test@test.com' } },
      logoutAction()
    );
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
    expect(localStorage.getItem('six-cities-token')).toBeNull();
  });
});

