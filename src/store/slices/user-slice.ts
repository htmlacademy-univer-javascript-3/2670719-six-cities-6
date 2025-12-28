import { createReducer } from '@reduxjs/toolkit';
import { requireAuthorization } from '../action';
import { checkAuthAction, loginAction } from '../thunk';

type UserState = {
  authorizationStatus: string;
  user: {
    email: string;
  } | null;
}

const initialState: UserState = {
  authorizationStatus: 'UNKNOWN',
  user: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requireAuthorization, (state, action) => {
      state.authorizationStatus = action.payload;
    })
    .addCase(checkAuthAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = { email: action.payload.email };
    })
    .addCase(checkAuthAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    })
    .addCase(loginAction.fulfilled, (state, action) => {
      state.authorizationStatus = 'AUTH';
      state.user = { email: action.payload.email };
    })
    .addCase(loginAction.rejected, (state) => {
      state.authorizationStatus = 'NO_AUTH';
      state.user = null;
    });
});

