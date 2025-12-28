import { describe, it, expect } from 'vitest';
import { userReducer } from '../user-slice';
import { requireAuthorization } from '../../action';
import { checkAuthAction, loginAction } from '../../thunk';
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
      { authorizationStatus: 'UNKNOWN', user: null },
      loginAction.rejected(new Error(), '', { email: 'test@test.com', password: 'password' }, 'Error')
    );
    expect(state.authorizationStatus).toBe('NO_AUTH');
    expect(state.user).toBeNull();
  });
});

