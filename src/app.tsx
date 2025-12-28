import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainPage from './components/main-page/main-page';
import LoginPage from './components/login-page/login-page';
import FavoritesPage from './components/favorites-page/favorites-page';
import PropertyPage from './components/property-page/property-page';
import NotFoundPage from './components/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';
import { RootState } from './store';

function App(): JSX.Element {
  const authorizationStatus = 'NO_AUTH';
  const offers = useSelector((state: RootState) => state.data.offers);
  const favoriteOffers = offers.filter((offer) => offer.isFavorite);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
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

