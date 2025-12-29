import { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavoriteOffersAction, toggleFavoriteAction } from '../../store/thunk';
import { AppDispatch } from '../../store';
import { selectFavoriteOffers, selectIsFavoritesLoading, selectAuthorizationStatus, selectUser } from '../../store/selectors';
import type { Offer } from '../../types/offer';
import Spinner from '../../components/spinner/spinner';
import { RATING_WIDTH_MULTIPLIER } from '../../constants/constants';

function FavoritesPage(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const offers = useSelector(selectFavoriteOffers);
  const isLoading = useSelector(selectIsFavoritesLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (authorizationStatus === 'AUTH') {
      dispatch(fetchFavoriteOffersAction());
    }
  }, [authorizationStatus, dispatch]);

  const handleFavoriteClick = useCallback((offerId: string, isFavorite: boolean) => {
    dispatch(toggleFavoriteAction({ offerId, isFavorite }));
  }, [dispatch]);
  if (isLoading) {
    return (
      <div className="page">
        <Spinner />
      </div>
    );
  }

  const offersByCity = offers.reduce((acc: Record<string, Offer[]>, offer: Offer) => {
    const cityName = offer.city.name;
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(offer);
    return acc;
  }, {});

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width="81" height="41" />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to="/favorites">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">{user?.email}</span>
                    <span className="header__favorite-count">{offers.length}</span>
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

      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>
            {offers.length === 0 ? (
              <div className="favorites__status-wrapper">
                <b className="favorites__status">Nothing yet saved.</b>
                <p className="favorites__status-description">Save properties to narrow down search or plan your future trips.</p>
              </div>
            ) : (
              <ul className="favorites__list">
                {Object.entries(offersByCity).map(([cityName, cityOffers]) => (
                  <li key={cityName} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <a className="locations__item-link" href="#">
                          <span>{cityName}</span>
                        </a>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <article key={offer.id} className="favorites__card place-card">
                          {offer.isPremium && (
                            <div className="place-card__mark">
                              <span>Premium</span>
                            </div>
                          )}
                          <div className="favorites__image-wrapper place-card__image-wrapper">
                            <Link to={`/offer/${offer.id}`}>
                              <img className="place-card__image" src={offer.previewImage} width="150" height="110" alt="Place image" />
                            </Link>
                          </div>
                          <div className="favorites__card-info place-card__info">
                            <div className="place-card__price-wrapper">
                              <div className="place-card__price">
                                <b className="place-card__price-value">&euro;{offer.price}</b>
                                <span className="place-card__price-text">&#47;&nbsp;night</span>
                              </div>
                              <button
                                className="place-card__bookmark-button place-card__bookmark-button--active button"
                                type="button"
                                onClick={() => handleFavoriteClick(offer.id, false)}
                              >
                                <svg className="place-card__bookmark-icon" width="18" height="19">
                                  <use xlinkHref="#icon-bookmark"></use>
                                </svg>
                                <span className="visually-hidden">In bookmarks</span>
                              </button>
                            </div>
                            <div className="place-card__rating rating">
                              <div className="place-card__stars rating__stars">
                                <span style={{width: `${offer.rating * RATING_WIDTH_MULTIPLIER}%`}}></span>
                                <span className="visually-hidden">Rating</span>
                              </div>
                            </div>
                            <h2 className="place-card__name">
                              <Link to={`/offer/${offer.id}`}>{offer.title}</Link>
                            </h2>
                            <p className="place-card__type">{offer.type}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img className="footer__logo" src="img/logo.svg" alt="6 cities logo" width="64" height="33" />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;

