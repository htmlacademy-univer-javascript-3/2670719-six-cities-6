import { memo, useCallback } from 'react';
import OfferCard from '../offer-card/offer-card';
import type { Offer } from '../../types/offer';

type OffersListProps = {
  offers: Offer[];
  onCardMouseEnter?: (id: string) => void;
  onCardMouseLeave?: () => void;
}

const OffersList = memo(({offers, onCardMouseEnter, onCardMouseLeave}: OffersListProps): JSX.Element => {
  const handleCardMouseEnter = useCallback((id: string) => {
    onCardMouseEnter?.(id);
  }, [onCardMouseEnter]);

  const handleCardMouseLeave = useCallback(() => {
    onCardMouseLeave?.();
  }, [onCardMouseLeave]);

  return (
    <div className="cities__places-list places__list tabs__content">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onMouseEnter={handleCardMouseEnter}
          onMouseLeave={handleCardMouseLeave}
        />
      ))}
    </div>
  );
});

OffersList.displayName = 'OffersList';

export default OffersList;

