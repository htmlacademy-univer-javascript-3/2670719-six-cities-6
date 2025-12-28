import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeSorting } from '../../store/action';
import { RootState } from '../../store';

const SORT_OPTIONS = [
  'Popular',
  'Price: low to high',
  'Price: high to low',
  'Top rated first',
] as const;

function SortOptions(): JSX.Element {
  const dispatch = useDispatch();
  const currentSorting = useSelector((state: RootState) => state.data.sorting);
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    dispatch(changeSorting(option));
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentSorting}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className={`places__options places__options--custom ${isOpen ? 'places__options--opened' : ''}`}>
        {SORT_OPTIONS.map((option) => (
          <li
            key={option}
            className={`places__option ${currentSorting === option ? 'places__option--active' : ''}`}
            tabIndex={0}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SortOptions;

