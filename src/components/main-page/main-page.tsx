import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import OffersList from '../offers-list/offers-list';
import Map from '../map/map';
import CitiesList from '../cities-list/cities-list';
import SortOptions from '../sort-options/sort-options';
import Spinner from '../spinner/spinner';
import { RootState } from '../../store';
import { sortOffers } from '../../utils/sorting';

function MainPage(): JSX.Element {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const currentCity = useSelector((state: RootState) => state.data.city);
  const currentSorting = useSelector((state: RootState) => state.data.sorting);
  const isLoading = useSelector((state: RootState) => state.data.isLoading);
  const allOffers = useSelector((state: RootState) => state.data.offers);
  const filteredOffers = allOffers.filter((offer) => offer.city.name === currentCity);
  const offers = sortOffers(filteredOffers, currentSorting);
  const city = offers[0]?.city || filteredOffers[0]?.city || { name: currentCity, location: { latitude: 52.37454, longitude: 4.897976, zoom: 13 } };

  if (isLoading) {
    return (
      <div className="page page--gray page--main">
        <Spinner />
      </div>
    );
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
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
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
              <OffersList offers={offers} onCardMouseEnter={setSelectedOfferId} onCardMouseLeave={() => setSelectedOfferId(null)} />
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

