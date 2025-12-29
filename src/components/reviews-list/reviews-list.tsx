import { useMemo } from 'react';
import ReviewItem from '../review-item/review-item';
import type { Review } from '../../types/review';
import { MAX_REVIEWS_DISPLAY } from '../../constants/constants';

type ReviewsListProps = {
  reviews: Review[];
}

function ReviewsList({reviews}: ReviewsListProps): JSX.Element {
  const sortedAndLimitedReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    return sorted.slice(0, MAX_REVIEWS_DISPLAY);
  }, [reviews]);

  return (
    <>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews.length}</span></h2>
      <ul className="reviews__list">
        {sortedAndLimitedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </>
  );
}

export default ReviewsList;

