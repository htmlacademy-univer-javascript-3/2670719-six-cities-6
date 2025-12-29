import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './app/app';
import { fetchOffersAction, checkAuthAction, fetchFavoriteOffersAction } from './store/thunk/thunk';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(fetchOffersAction());
store.dispatch(checkAuthAction()).then((action) => {
  if (checkAuthAction.fulfilled.match(action)) {
    store.dispatch(fetchFavoriteOffersAction());
  }
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
