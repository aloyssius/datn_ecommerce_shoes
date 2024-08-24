import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
import LoadingScreenCustom from '../components/LoadingScreenCustom';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <LoadingScreenCustom isAuth />;
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  if (isAuthenticated && user?.role === 'employee') {
    return <Navigate to={PATH_DASHBOARD.bill.root} />;
  }

  return <>{children}</>;
}
