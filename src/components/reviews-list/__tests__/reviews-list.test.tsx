import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewsList from '../reviews-list';
import type { Review } from '../../../types/review';

const mockReviews: Review[] = [
  {
    id: '1',
    date: '2024-01-15',
    user: {
      name: 'Test User 1',
      avatarUrl: 'avatar1.jpg',
      isPro: false,
    },
    comment: 'Test comment 1',
    rating: 5,
  },
  {
    id: '2',
    date: '2024-01-16',
    user: {
      name: 'Test User 2',
      avatarUrl: 'avatar2.jpg',
      isPro: true,
    },
    comment: 'Test comment 2',
    rating: 4,
  },
];

describe('ReviewsList', () => {
  it('should render correctly', () => {
    const { container } = render(<ReviewsList reviews={mockReviews} />);
    expect(container).toBeTruthy();
  });

  it('should display reviews count', () => {
    render(<ReviewsList reviews={mockReviews} />);
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should render all reviews', () => {
    render(<ReviewsList reviews={mockReviews} />);
    expect(screen.getByText('Test comment 1')).toBeInTheDocument();
    expect(screen.getByText('Test comment 2')).toBeInTheDocument();
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  it('should render empty list', () => {
    render(<ReviewsList reviews={[]} />);
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    const reviewsList = screen.queryByRole('list');
    expect(reviewsList).toBeInTheDocument();
  });

  it('should render reviews in a list', () => {
    render(<ReviewsList reviews={mockReviews} />);
    const reviewsList = screen.getByRole('list');
    expect(reviewsList).toHaveClass('reviews__list');
    const listItems = reviewsList.querySelectorAll('li');
    expect(listItems.length).toBe(2);
  });
});

