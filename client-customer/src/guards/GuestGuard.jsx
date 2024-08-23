import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import LoadingScreen from '../components/shared/LoadingScreen';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_PAGE } from '../routes/path';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen isAuth />
  }

  if (isAuthenticated) {
    return <Redirect to={PATH_PAGE.root} push />
  }

  return <>{children}</>;
}
