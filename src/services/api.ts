import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BACKEND_URL = 'https://15.design.htmlacademy.pro/six-cities';
const REQUEST_TIMEOUT = 5000;

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
      if (error.response?.status === 401) {
        // Обработка 401 - неавторизован
        localStorage.removeItem(TOKEN_KEY_NAME);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

