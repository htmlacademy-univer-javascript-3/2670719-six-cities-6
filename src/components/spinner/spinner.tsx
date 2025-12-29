import {
  SPINNER_SIZE,
  SPINNER_BORDER_WIDTH,
  SPINNER_CONTAINER_MIN_HEIGHT,
  SPINNER_ROTATION_DEGREES,
  SPINNER_ANIMATION_DURATION,
} from '../../constants/constants';

function Spinner(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: `${SPINNER_CONTAINER_MIN_HEIGHT}px`,
      }}
    >
      <div
        style={{
          width: `${SPINNER_SIZE}px`,
          height: `${SPINNER_SIZE}px`,
          border: `${SPINNER_BORDER_WIDTH}px solid #f3f3f3`,
          borderTop: `${SPINNER_BORDER_WIDTH}px solid #4481c3`,
          borderRadius: '50%',
          animation: `spin ${SPINNER_ANIMATION_DURATION}s linear infinite`,
        }}
      >
      </div>
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(${SPINNER_ROTATION_DEGREES}deg); }
        }
      `}
      </style>
    </div>
  );
}

export default Spinner;

