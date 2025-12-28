import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
    const { getByText } = render(<ReviewItem review={mockReview} />);
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('should display comment', () => {
    const { getByText } = render(<ReviewItem review={mockReview} />);
    expect(getByText('Test comment')).toBeInTheDocument();
  });
});

