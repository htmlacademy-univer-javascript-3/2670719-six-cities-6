import { Routes, Route } from 'react-router-dom';
import MainPage from './components/main-page/main-page';
import LoginPage from './components/login-page/login-page';
import FavoritesPage from './components/favorites-page/favorites-page';
import PropertyPage from './components/property-page/property-page';
import NotFoundPage from './components/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';

type AppProps = {
  offersCount: number;
}

function App({offersCount}: AppProps): JSX.Element {
  const authorizationStatus = 'NO_AUTH';

  return (
    <Routes>
      <Route path="/" element={<MainPage offersCount={offersCount} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute authorizationStatus={authorizationStatus}>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<PropertyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

