import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
    const { container } = render(<ReviewsList reviews={mockReviews} />);
    expect(container.querySelector('.reviews__title')).toBeInTheDocument();
    expect(container.querySelector('.reviews__amount')?.textContent).toBe('2');
  });

  it('should render all reviews', () => {
    const { getByText } = render(<ReviewsList reviews={mockReviews} />);
    expect(getByText('Test comment 1')).toBeInTheDocument();
    expect(getByText('Test comment 2')).toBeInTheDocument();
  });

  it('should render empty list', () => {
    const { container } = render(<ReviewsList reviews={[]} />);
    expect(container.querySelector('.reviews__title')).toBeInTheDocument();
    expect(container.querySelector('.reviews__amount')?.textContent).toBe('0');
  });
});

