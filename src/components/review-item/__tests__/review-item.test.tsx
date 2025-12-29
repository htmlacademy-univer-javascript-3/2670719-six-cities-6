import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewItem from '../review-item';
import type { Review } from '../../../types/review';

const mockReview: Review = {
  id: '1',
  date: '2024-01-15',
  user: {
    name: 'Test User',
    avatarUrl: 'avatar.jpg',
    isPro: false,
  },
  comment: 'Test comment',
  rating: 5,
};

describe('ReviewItem', () => {
  it('should render correctly', () => {
    const { container } = render(<ReviewItem review={mockReview} />);
    expect(container).toBeTruthy();
  });

  it('should display user name', () => {
    render(<ReviewItem review={mockReview} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should display comment', () => {
    render(<ReviewItem review={mockReview} />);
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('should display user avatar', () => {
    render(<ReviewItem review={mockReview} />);
    const avatar = screen.getByAltText('Reviews avatar');
    expect(avatar).toHaveAttribute('src', 'avatar.jpg');
  });

  it('should render review with pro user', () => {
    const proReview = {
      ...mockReview,
      user: {
        ...mockReview.user,
        isPro: true,
      },
    };
    render(<ReviewItem review={proReview} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
  });

  it('should display formatted date', () => {
    render(<ReviewItem review={mockReview} />);
    // Date should be formatted and displayed
    const dateElement = screen.getByText(/January/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('should display rating stars', () => {
    render(<ReviewItem review={mockReview} />);
    const ratingStars = screen.getByText('Rating').closest('.reviews__stars');
    expect(ratingStars).toBeInTheDocument();
  });
});

