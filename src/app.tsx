import { Routes, Route } from 'react-router-dom';
import MainPage from './components/main-page/main-page';
import LoginPage from './components/login-page/login-page';
import FavoritesPage from './components/favorites-page/favorites-page';
import PropertyPage from './components/property-page/property-page';
import NotFoundPage from './components/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';
import type { Offer } from './mocks/offers';

type AppProps = {
  offers: Offer[];
}

function App({offers}: AppProps): JSX.Element {
  const authorizationStatus = 'NO_AUTH';
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);

  return (
    <Routes>
      <Route path="/" element={<MainPage offers={offers} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute authorizationStatus={authorizationStatus}>
            <FavoritesPage offers={favoriteOffers} />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<PropertyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

