import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import CustomerNewEditForm from './CustomerNewEditForm';

// ----------------------------------------------------------------------

export default function CustomerNewEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const currentCustomer = {};

  return (

    <Page title={`Quản lý khách hàng - ${!isEdit ? 'Tạo khách hàng' : 'Cập nhật khách hàng'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo khách hàng' : 'Cập nhật khách hàng'}
          links={[
            { name: 'Danh sách khách hàng', href: PATH_DASHBOARD.account.customer.list },
            { name: !isEdit ? 'Tạo khách hàng' : 'Customer-name' },
          ]}
        />
        <CustomerNewEditForm isEdit={isEdit} currentCustomer={currentCustomer} />
      </Container>
    </Page>
  );
}
