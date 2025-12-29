import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/main-page/main-page';
import LoginPage from './pages/login-page/login-page';
import FavoritesPage from './pages/favorites-page/favorites-page';
import PropertyPage from './pages/property-page/property-page';
import NotFoundPage from './pages/not-found-page/not-found-page';
import PrivateRoute from './components/private-route/private-route';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/favorites"
        element={
          <PrivateRoute>
            <FavoritesPage />
          </PrivateRoute>
        }
      />
      <Route path="/offer/:id" element={<PropertyPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

