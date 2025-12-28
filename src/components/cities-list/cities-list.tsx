import { useDispatch, useSelector } from 'react-redux';
import { changeCity } from '../../store/action';
import { RootState } from '../../store';

const CITIES = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;

function CitiesList(): JSX.Element {
  const dispatch = useDispatch();
  const currentCity = useSelector((state: RootState) => state.data.city);

  const handleCityClick = (city: string) => {
    dispatch(changeCity(city));
  };

  return (
    <section className="locations container">
      <ul className="locations__list tabs__list">
        {CITIES.map((city) => (
          <li key={city} className="locations__item">
            <a
              className={`locations__item-link tabs__item ${currentCity === city ? 'tabs__item--active' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleCityClick(city);
              }}
            >
              <span>{city}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CitiesList;

