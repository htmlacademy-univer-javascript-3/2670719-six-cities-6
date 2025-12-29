import type { Review } from '../../types/review';
import { RATING_WIDTH_MULTIPLIER, AVATAR_SIZE_REVIEW } from '../../constants/constants';

type ReviewItemProps = {
  review: Review;
}

function ReviewItem({review}: ReviewItemProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img className="reviews__avatar user__avatar" src={review.user.avatarUrl} width={AVATAR_SIZE_REVIEW} height={AVATAR_SIZE_REVIEW} alt="Reviews avatar" />
        </div>
        <span className="reviews__user-name">
          {review.user.name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `${review.rating * RATING_WIDTH_MULTIPLIER}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {review.comment}
        </p>
        <time className="reviews__time" dateTime={review.date}>{formatDate(review.date)}</time>
      </div>
    </li>
  );
}

export default ReviewItem;

