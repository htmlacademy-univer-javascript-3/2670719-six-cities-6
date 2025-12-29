import { useEffect, useCallback } from 'react';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReviewForm from '../../components/review-form/review-form';
import ReviewsList from '../../components/reviews-list/reviews-list';
import Map from '../../components/map/map';
import NearbyOffersList from '../../components/nearby-offers-list/nearby-offers-list';
import Spinner from '../../components/spinner/spinner';
import { AppDispatch } from '../../store';
import { fetchOfferAction, fetchNearbyOffersAction, fetchReviewsAction, toggleFavoriteAction } from '../../store/thunk';
import {
  selectCurrentOffer,
  selectNearbyOffers,
  selectReviews,
  selectIsOfferLoading,
  selectAuthorizationStatus,
} from '../../store/selectors';
import {
  MAX_PROPERTY_IMAGES,
  RATING_WIDTH_MULTIPLIER,
  LOGO_WIDTH,
  LOGO_HEIGHT,
  BOOKMARK_ICON_WIDTH,
  BOOKMARK_ICON_HEIGHT,
  AVATAR_SIZE_HOST,
} from '../../constants/constants';

function PropertyPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentOffer = useSelector(selectCurrentOffer);
  const nearbyOffers = useSelector(selectNearbyOffers);
  const reviews = useSelector(selectReviews);
  const isOfferLoading = useSelector(selectIsOfferLoading);
  const authorizationStatus = useSelector(selectAuthorizationStatus);

  const handleFavoriteClick = useCallback(() => {
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }
    if (currentOffer) {
      dispatch(toggleFavoriteAction({ offerId: currentOffer.id, isFavorite: !currentOffer.isFavorite }));
    }
  }, [authorizationStatus, currentOffer, dispatch, navigate]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [id, dispatch]);

  if (isOfferLoading) {
    return (
      <div className="page">
        <Spinner />
      </div>
    );
  }

  if (!currentOffer) {
    return <Navigate to="/404" />;
  }

  const city = currentOffer.city;

  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to="/">
                <img className="header__logo" src="img/logo.svg" alt="6 cities logo" width={LOGO_WIDTH} height={LOGO_HEIGHT} />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <a className="header__nav-link header__nav-link--profile" href="#">
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">3</span>
                  </a>
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

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {currentOffer.images?.slice(0, MAX_PROPERTY_IMAGES).map((image) => (
                <div key={image} className="property__image-wrapper">
                  <img className="property__image" src={image} alt="Photo studio" />
                </div>
              ))}
            </div>
          </div>
          <div className="property__container container">
            <div className="property__wrapper">
              {currentOffer.isPremium && (
                <div className="property__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="property__name-wrapper">
                <h1 className="property__name">
                  {currentOffer.title}
                </h1>
                <button
                  className={`property__bookmark-button ${currentOffer.isFavorite ? 'property__bookmark-button--active' : ''} button`}
                  type="button"
                  onClick={handleFavoriteClick}
                >
                  <svg className="property__bookmark-icon" width={BOOKMARK_ICON_WIDTH} height={BOOKMARK_ICON_HEIGHT}>
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{currentOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{width: `${currentOffer.rating * RATING_WIDTH_MULTIPLIER}%`}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">{currentOffer.rating}</span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">
                  {currentOffer.type}
                </li>
                {currentOffer.bedrooms && (
                  <li className="property__feature property__feature--bedrooms">
                    {currentOffer.bedrooms} Bedrooms
                  </li>
                )}
                {currentOffer.maxAdults && (
                  <li className="property__feature property__feature--adults">
                    Max {currentOffer.maxAdults} adults
                  </li>
                )}
              </ul>
              <div className="property__price">
                <b className="property__price-value">&euro;{currentOffer.price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              {currentOffer.goods && currentOffer.goods.length > 0 && (
                <div className="property__inside">
                  <h2 className="property__inside-title">What&apos;s inside</h2>
                  <ul className="property__inside-list">
                    {currentOffer.goods.map((good) => (
                      <li key={good} className="property__inside-item">
                        {good}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentOffer.host && (
                <div className="property__host">
                  <h2 className="property__host-title">Meet the host</h2>
                  <div className="property__host-user user">
                    <div className={`property__avatar-wrapper ${currentOffer.host.isPro ? 'property__avatar-wrapper--pro' : ''} user__avatar-wrapper`}>
                      <img className="property__avatar user__avatar" src={currentOffer.host.avatarUrl} width={AVATAR_SIZE_HOST} height={AVATAR_SIZE_HOST} alt="Host avatar" />
                    </div>
                    <span className="property__user-name">
                      {currentOffer.host.name}
                    </span>
                    {currentOffer.host.isPro && (
                      <span className="property__user-status">
                        Pro
                      </span>
                    )}
                  </div>
                  {currentOffer.description && (
                    <div className="property__description">
                      {currentOffer.description.split('\n').map((paragraph) => (
                        <p key={paragraph} className="property__text">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <section className="property__reviews reviews">
                <ReviewsList reviews={reviews} />
                {authorizationStatus === 'AUTH' && <ReviewForm offerId={id || ''} />}
              </section>
            </div>
          </div>
          <section className="property__map map">
            <Map city={city} offers={nearbyOffers} />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <NearbyOffersList offers={nearbyOffers} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default PropertyPage;

