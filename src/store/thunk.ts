import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { Offer } from '../types/offer';

export const fetchOffersAction = createAsyncThunk<
  Offer[],
  undefined,
  {
    extra: AxiosInstance;
  }
>(
  'data/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>('/offers');
    return data;
  }
);

