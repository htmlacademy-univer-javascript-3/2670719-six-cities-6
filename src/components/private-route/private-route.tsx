import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: JSX.Element;
  authorizationStatus: string;
}

function PrivateRoute({children, authorizationStatus}: PrivateRouteProps): JSX.Element {
  return authorizationStatus === 'AUTH' ? children : <Navigate to="/login" />;
}

export default PrivateRoute;

