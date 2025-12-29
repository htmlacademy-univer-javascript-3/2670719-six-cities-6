import { memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteAction } from '../../store/thunk';
import { AppDispatch } from '../../store';
import { selectAuthorizationStatus } from '../../store/selectors';
import type { Offer } from '../../types/offer';
import {
  RATING_WIDTH_MULTIPLIER,
  OFFER_CARD_IMAGE_WIDTH,
  OFFER_CARD_IMAGE_HEIGHT,
  OFFER_CARD_BOOKMARK_ICON_WIDTH,
  OFFER_CARD_BOOKMARK_ICON_HEIGHT,
} from '../../constants/constants';

type OfferCardProps = {
  offer: Offer;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: () => void;
}

const OfferCard = memo(({offer, onMouseEnter, onMouseLeave}: OfferCardProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authorizationStatus = useSelector(selectAuthorizationStatus);

  const handleMouseEnter = useCallback(() => {
    onMouseEnter?.(offer.id);
  }, [offer.id, onMouseEnter]);

  const handleMouseLeave = useCallback(() => {
    onMouseLeave?.();
  }, [onMouseLeave]);

  const handleFavoriteClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }
    dispatch(toggleFavoriteAction({ offerId: offer.id, isFavorite: !offer.isFavorite }));
  }, [authorizationStatus, offer.id, offer.isFavorite, dispatch, navigate]);

  return (
    <article
      className="cities__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {offer.isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
        <Link to={`/offer/${offer.id}`}>
          <img className="place-card__image" src={offer.previewImage} width={OFFER_CARD_IMAGE_WIDTH} height={OFFER_CARD_IMAGE_HEIGHT} alt="Place image" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''} button`}
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg className="place-card__bookmark-icon" width={OFFER_CARD_BOOKMARK_ICON_WIDTH} height={OFFER_CARD_BOOKMARK_ICON_HEIGHT}>
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">{offer.isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
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
  );
});

OfferCard.displayName = 'OfferCard';

export default OfferCard;
