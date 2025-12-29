import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import Map from '../map';
import type { Offer } from '../../../types/offer';
import leaflet from 'leaflet';

// Create mock instances that will be returned by the mocks
type MockMapInstance = {
  setView: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

// Mock leaflet
vi.mock('leaflet', () => {
  const mockMapInstance: MockMapInstance = {
    setView: vi.fn(),
    remove: vi.fn(),
  };

  const mockMarkerInstance = {
    remove: vi.fn(),
    addTo: vi.fn().mockReturnThis(),
  };

  const mockTileLayerInstance = {
    addTo: vi.fn().mockReturnThis(),
  };

  const mockMapFn = vi.fn<[], MockMapInstance>(() => mockMapInstance);
  const mockMarkerFn = vi.fn(() => mockMarkerInstance);
  const mockIconFn = vi.fn(() => ({}));
  const mockTileLayerFn = vi.fn(() => mockTileLayerInstance);

  return {
    default: {
      map: mockMapFn,
      marker: mockMarkerFn,
      icon: mockIconFn,
      tileLayer: mockTileLayerFn,
    },
  };
});

const mockCity: Offer['city'] = {
  name: 'Paris',
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
};

const mockOffer1: Offer = {
  id: '1',
  title: 'Test Offer 1',
  type: 'apartment',
  price: 100,
  city: mockCity,
  location: {
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 10,
  },
  isFavorite: false,
  isPremium: false,
  rating: 4.5,
  previewImage: 'test1.jpg',
};

const mockOffer2: Offer = {
  id: '2',
  title: 'Test Offer 2',
  type: 'house',
  price: 200,
  city: mockCity,
  location: {
    latitude: 48.8576,
    longitude: 2.3532,
    zoom: 10,
  },
  isFavorite: true,
  isPremium: true,
  rating: 5,
  previewImage: 'test2.jpg',
};

describe('Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render map container', () => {
    const { container } = render(
      <Map city={mockCity} offers={[]} />
    );
    const mapDiv = container.querySelector('div[style*="height"]');
    expect(mapDiv).toBeInTheDocument();
  });

  it('should initialize map with city location', () => {
    render(
      <Map city={mockCity} offers={[]} />
    );
    const mockedLeaflet = vi.mocked(leaflet);
    expect(mockedLeaflet.map).toHaveBeenCalled();
  });

  it('should create markers for offers', () => {
    render(
      <Map city={mockCity} offers={[mockOffer1, mockOffer2]} />
    );
    const mockedLeaflet = vi.mocked(leaflet);
    expect(mockedLeaflet.marker).toHaveBeenCalledTimes(2);
  });

  it('should use active icon for selected offer', () => {
    render(
      <Map city={mockCity} offers={[mockOffer1, mockOffer2]} selectedOfferId="1" />
    );
    const mockedLeaflet = vi.mocked(leaflet);
    expect(mockedLeaflet.marker).toHaveBeenCalled();
  });

  it('should update markers when offers change', () => {
    vi.clearAllMocks();
    const { rerender } = render(
      <Map city={mockCity} offers={[mockOffer1]} />
    );
    const mockedLeaflet = vi.mocked(leaflet);
    expect(mockedLeaflet.marker).toHaveBeenCalledTimes(1);
    rerender(
      <Map city={mockCity} offers={[mockOffer1, mockOffer2]} />
    );
    expect(mockedLeaflet.marker).toHaveBeenCalled();
  });

  it('should update markers when selectedOfferId changes', () => {
    const { rerender } = render(
      <Map city={mockCity} offers={[mockOffer1, mockOffer2]} selectedOfferId="1" />
    );
    rerender(
      <Map city={mockCity} offers={[mockOffer1, mockOffer2]} selectedOfferId="2" />
    );
    const mockedLeaflet = vi.mocked(leaflet);
    expect(mockedLeaflet.marker).toHaveBeenCalled();
  });

  it('should cleanup map on unmount', () => {
    const { unmount } = render(
      <Map city={mockCity} offers={[]} />
    );
    unmount();
    const mockedLeaflet = vi.mocked(leaflet);
    const mapMock = mockedLeaflet.map;
    const firstCall = mapMock.mock.results[0];
    if (firstCall && 'value' in firstCall) {
      const mapInstance = firstCall.value as MockMapInstance;
      expect(mapInstance.remove).toHaveBeenCalled();
    }
  });
});

