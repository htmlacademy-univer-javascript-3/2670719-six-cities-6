export type Offer = {
  id: string;
  title: string;
  type: string;
  price: number;
  city: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
      zoom: number;
    };
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
  description?: string;
  bedrooms?: number;
  maxAdults?: number;
  goods?: string[];
  host?: {
    name: string;
    avatarUrl: string;
    isPro: boolean;
  };
  images?: string[];
};

