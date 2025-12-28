import { useState } from 'react';
import OfferCard from '../offer-card/offer-card';
import type { Offer } from '../../mocks/offers';

type OffersListProps = {
  offers: Offer[];
}

function OffersList({offers}: OffersListProps): JSX.Element {
  const [, setActiveOfferId] = useState<string | null>(null);

  const handleCardMouseEnter = (id: string) => {
    setActiveOfferId(id);
  };

  const handleCardMouseLeave = () => {
    setActiveOfferId(null);
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

