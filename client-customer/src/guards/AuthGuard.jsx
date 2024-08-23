import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
import { PATH_PAGE } from '../routes/path';
import LoadingScreen from '../components/shared/LoadingScreen';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen isAuth />
  }

  if (!isAuthenticated) {
    return <Redirect to={PATH_PAGE.root} />
  }

  return <>{children}</>;
}
