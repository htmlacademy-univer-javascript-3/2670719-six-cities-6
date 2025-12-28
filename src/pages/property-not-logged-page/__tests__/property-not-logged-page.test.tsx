import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PropertyNotLoggedPage from '../property-not-logged-page';

describe('PropertyNotLoggedPage', () => {
  it('should render correctly', () => {
    render(<PropertyNotLoggedPage />);
    expect(screen.getByText(/Beautiful & luxurious studio at great location/i)).toBeInTheDocument();
  });

  it('should render premium badge', () => {
    render(<PropertyNotLoggedPage />);
    const premiumBadges = screen.getAllByText('Premium');
    expect(premiumBadges.length).toBeGreaterThan(0);
    const propertySection = screen.getByText(/Beautiful & luxurious studio/i).closest('.property');
    expect(propertySection?.querySelector('.property__mark')).toHaveTextContent('Premium');
  });

  it('should render property features', () => {
    render(<PropertyNotLoggedPage />);
    const featuresList = screen.getByText('3 Bedrooms').closest('ul');
    expect(featuresList).toBeInTheDocument();
    expect(featuresList?.querySelector('.property__feature--entire')).toHaveTextContent('Apartment');
    expect(screen.getByText('3 Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Max 4 adults')).toBeInTheDocument();
    const apartmentInFeatures = featuresList?.querySelector('.property__feature--entire');
    expect(apartmentInFeatures).toHaveTextContent('Apartment');
  });

  it('should render property amenities', () => {
    render(<PropertyNotLoggedPage />);
    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
  });

  it('should render host information', () => {
    render(<PropertyNotLoggedPage />);
    expect(screen.getByText('Meet the host')).toBeInTheDocument();
    expect(screen.getByText('Angelina')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('should render reviews section', () => {
    render(<PropertyNotLoggedPage />);
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });
});

