import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import type { Offer } from '../types/offer';
import type { AuthInfo, LoginData } from '../types/auth';
import type { Review, ReviewData } from '../types/review';

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

export const checkAuthAction = createAsyncThunk<
  AuthInfo,
  undefined,
  {
    extra: AxiosInstance;
    rejectValue: void;
  }
>(
  'user/checkAuth',
  async (_arg, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<AuthInfo>('/login');
      localStorage.setItem('six-cities-token', data.token);
      return data;
    } catch {
      localStorage.removeItem('six-cities-token');
      return rejectWithValue(undefined);
    }
  }
);

export const loginAction = createAsyncThunk<
  AuthInfo,
  LoginData,
  {
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'user/login',
  async ({ email, password }, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthInfo>('/login', { email, password });
      localStorage.setItem('six-cities-token', data.token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const fetchOfferAction = createAsyncThunk<
  Offer,
  string,
  {
    extra: AxiosInstance;
    rejectValue: void;
  }
>(
  'data/fetchOffer',
  async (offerId, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.get<Offer>(`/offers/${offerId}`);
      return data;
    } catch {
      return rejectWithValue(undefined);
    }
  }
);

export const fetchNearbyOffersAction = createAsyncThunk<
  Offer[],
  string,
  {
    extra: AxiosInstance;
  }
>(
  'data/fetchNearbyOffers',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer[]>(`/offers/${offerId}/nearby`);
    return data;
  }
);

export const fetchReviewsAction = createAsyncThunk<
  Review[],
  string,
  {
    extra: AxiosInstance;
  }
>(
  'data/fetchReviews',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Review[]>(`/comments/${offerId}`);
    return data;
  }
);

export const postReviewAction = createAsyncThunk<
  Review,
  { offerId: string; reviewData: ReviewData },
  {
    extra: AxiosInstance;
    rejectValue: string;
  }
>(
  'data/postReview',
  async ({ offerId, reviewData }, { extra: api, rejectWithValue }) => {
    try {
      const { data } = await api.post<Review>(`/comments/${offerId}`, reviewData);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Unknown error');
    }
  }
);

