import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { user } = useAuth();

  if (!accessibleRoles.includes(user?.role)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Quyền truy cập bị từ chối</AlertTitle>
          Bạn không có quyền truy cập trang này
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
