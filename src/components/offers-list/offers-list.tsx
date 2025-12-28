import OfferCard from '../offer-card/offer-card';
import type { Offer } from '../../types/offer';

type OffersListProps = {
  offers: Offer[];
  onCardMouseEnter?: (id: string) => void;
  onCardMouseLeave?: () => void;
}

function OffersList({offers, onCardMouseEnter, onCardMouseLeave}: OffersListProps): JSX.Element {
  const handleCardMouseEnter = (id: string) => {
    if (onCardMouseEnter) {
      onCardMouseEnter(id);
    }
  };

  const handleCardMouseLeave = () => {
    if (onCardMouseLeave) {
      onCardMouseLeave();
    }
  };

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
}

export default OffersList;

