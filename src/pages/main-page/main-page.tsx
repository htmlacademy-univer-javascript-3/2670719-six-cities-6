import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OffersList from '../../components/offers-list/offers-list';
import Map from '../../components/map/map';
import CitiesList from '../../components/cities-list/cities-list';
import SortOptions from '../../components/sort-options/sort-options';
import Spinner from '../../components/spinner/spinner';
import MainEmptyPage from '../main-empty-page/main-empty-page';
import {
  selectIsLoading,
  selectSortedOffers,
  selectCityFromOffers,
  selectAuthorizationStatus,
  selectUser,
  selectFavoriteOffers,
  selectCity,
} from '../../store/selectors';

function MainPage(): JSX.Element {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const isLoading = useSelector(selectIsLoading);
  const offers = useSelector(selectSortedOffers);
  const city = useSelector(selectCityFromOffers);
  const currentCity = useSelector(selectCity);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const user = useSelector(selectUser);
  const favoriteOffers = useSelector(selectFavoriteOffers);

  const handleCardMouseEnter = useCallback((id: string) => {
    setSelectedOfferId(id);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setSelectedOfferId(null);
  }, []);

  if (isLoading) {
    return (
      <div className="page page--gray page--main">
        <Spinner />
      </div>
    );
  }

  if (offers.length === 0) {
    return <MainEmptyPage />;
  }

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                {authorizationStatus === 'AUTH' ? (
                  <>
                    <li className="header__nav-item user">
                      <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                        <div className="header__avatar-wrapper user__avatar-wrapper">
                        </div>
                        <span className="header__user-name user__name">{user?.email}</span>
                        <span className="header__favorite-count">{favoriteOffers.length}</span>
                      </Link>
                    </li>
                    <li className="header__nav-item">
                      <a className="header__nav-link" href="#">
                        <span className="header__signout">Sign out</span>
                      </a>
                    </li>
                  </>
                ) : (
                  <li className="header__nav-item">
                    <Link className="header__nav-link" to="/login">
                      <span className="header__signout">Sign in</span>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <CitiesList />
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{offers.length} places to stay in {currentCity}</b>
              <SortOptions />
              <OffersList offers={offers} onCardMouseEnter={handleCardMouseEnter} onCardMouseLeave={handleCardMouseLeave} />
            </section>
            <div className="cities__right-section">
              <section className="cities__map map">
                <Map city={city} offers={offers} selectedOfferId={selectedOfferId} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

