import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { REQUEST_TIMEOUT, UNAUTHORIZED_STATUS_CODE } from '../constants/constants';

const BACKEND_URL = 'https://15.design.htmlacademy.pro/six-cities';

const TOKEN_KEY_NAME = 'six-cities-token';

export const createAPI = () => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(TOKEN_KEY_NAME);
      if (token && config.headers) {
        config.headers['x-token'] = token;
      }
      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === UNAUTHORIZED_STATUS_CODE) {
        // Обработка 401 - неавторизован
        localStorage.removeItem(TOKEN_KEY_NAME);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

