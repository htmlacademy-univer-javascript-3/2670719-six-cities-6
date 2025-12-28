import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type PrivateRouteProps = {
  children: JSX.Element;
}

function PrivateRoute({children}: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useSelector((state: RootState) => state.data.authorizationStatus);
  return authorizationStatus === 'AUTH' ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

