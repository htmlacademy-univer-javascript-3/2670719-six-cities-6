import { configureStore } from '@reduxjs/toolkit';
import { offersReducer } from './slices/offers-slice';
import { userReducer } from './slices/user-slice';
import { propertyReducer } from './slices/property-slice';
import { createAPI } from '../services/api';

const api = createAPI();

export const store = configureStore({
  reducer: {
    offers: offersReducer,
    user: userReducer,
    property: propertyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: api,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

