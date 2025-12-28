import { useEffect, useRef } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Offer } from '../../types/offer';

type MapProps = {
  city: Offer['city'];
  offers: Offer[];
  selectedOfferId?: string | null;
}

const defaultCustomIcon = leaflet.icon({
  iconUrl: 'img/pin.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

const currentCustomIcon = leaflet.icon({
  iconUrl: 'img/pin-active.svg',
  iconSize: [27, 39],
  iconAnchor: [13.5, 39],
});

function Map({city, offers, selectedOfferId}: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<leaflet.Map | null>(null);
  const markersRef = useRef<leaflet.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current && !map.current) {
      map.current = leaflet.map(mapRef.current, {
        center: {
          lat: city.location.latitude,
          lng: city.location.longitude,
        },
        zoom: city.location.zoom,
      });

      leaflet
        .tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        )
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [city]);

  useEffect(() => {
    if (map.current) {
      markersRef.current.forEach((marker) => {
        marker.remove();
      });
      markersRef.current = [];

      offers.forEach((offer) => {
        const marker = leaflet
          .marker(
            {
              lat: offer.location.latitude,
              lng: offer.location.longitude,
            },
            {
              icon: offer.id === selectedOfferId ? currentCustomIcon : defaultCustomIcon,
            },
          )
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }
  }, [offers, selectedOfferId]);

  return <div style={{height: '100%'}} ref={mapRef}></div>;
}

export default Map;

