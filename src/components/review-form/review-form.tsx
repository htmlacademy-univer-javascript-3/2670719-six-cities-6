import { useState, FormEvent, ChangeEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postReviewAction } from '../../store/thunk';
import { AppDispatch } from '../../store';
import { selectIsReviewPosting } from '../../store/selectors';
import {
  REVIEW_MIN_LENGTH,
  REVIEW_MAX_LENGTH,
  MAX_RATING,
  MIN_RATING,
  RATING_STAR_WIDTH,
  RATING_STAR_HEIGHT,
} from '../../constants/constants';

type ReviewFormProps = {
  offerId: string;
}

function ReviewForm({ offerId }: ReviewFormProps): JSX.Element {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const isReviewPosting = useSelector(selectIsReviewPosting);

  const handleRatingChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setRating(evt.target.value);
  }, []);

  const handleReviewChange = useCallback((evt: ChangeEvent<HTMLTextAreaElement>) => {
    setReview(evt.target.value);
  }, []);

  const handleSubmit = useCallback((evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (rating && review.length >= REVIEW_MIN_LENGTH && review.length <= REVIEW_MAX_LENGTH) {
      dispatch(postReviewAction({
        offerId,
        reviewData: {
          comment: review,
          rating: Number(rating),
        },
      })).then(() => {
        setRating('');
        setReview('');
      });
    }
  }, [rating, review, offerId, dispatch]);

  const isSubmitDisabled = !rating || review.length < REVIEW_MIN_LENGTH || review.length > REVIEW_MAX_LENGTH || isReviewPosting;

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={MAX_RATING}
          id={`${MAX_RATING}-stars`}
          type="radio"
          checked={rating === String(MAX_RATING)}
          onChange={handleRatingChange}
        />
        <label htmlFor={`${MAX_RATING}-stars`} className="reviews__rating-label form__rating-label" title="perfect">
          <svg className="form__star-image" width={RATING_STAR_WIDTH} height={RATING_STAR_HEIGHT}>
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={rating === '4'}
          onChange={handleRatingChange}
        />
        <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
          <svg className="form__star-image" width={RATING_STAR_WIDTH} height={RATING_STAR_HEIGHT}>
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={rating === '3'}
          onChange={handleRatingChange}
        />
        <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
          <svg className="form__star-image" width={RATING_STAR_WIDTH} height={RATING_STAR_HEIGHT}>
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={rating === '2'}
          onChange={handleRatingChange}
        />
        <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
          <svg className="form__star-image" width={RATING_STAR_WIDTH} height={RATING_STAR_HEIGHT}>
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value={MIN_RATING}
          id={`${MIN_RATING}-star`}
          type="radio"
          checked={rating === String(MIN_RATING)}
          onChange={handleRatingChange}
        />
        <label htmlFor={`${MIN_RATING}-star`} className="reviews__rating-label form__rating-label" title="terribly">
          <svg className="form__star-image" width={RATING_STAR_WIDTH} height={RATING_STAR_HEIGHT}>
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{REVIEW_MIN_LENGTH} characters</b>.
        </p>
        <button className="reviews__submit form__submit button" type="submit" disabled={isSubmitDisabled}>Submit</button>
      </div>
    </form>
  );
}

export default ReviewForm;

