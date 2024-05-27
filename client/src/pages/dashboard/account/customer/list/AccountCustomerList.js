import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Button,
  Container,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';
// hooks
import useSettings from '../../../../../hooks/useSettings';
// _mock_
import { _vouchers } from '../../../../../_mock';
// components
import Page from '../../../../../components/Page';
import Iconify from '../../../../../components/Iconify';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

export default function AccountCustomerList() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Quản lý khách hàng - Danh sách khách hàng">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Danh sách tài khoản khách hàng"
          links={[
            { name: 'Quản lý khách hàng', href: PATH_DASHBOARD.account.customer.list },
            { name: 'Danh sách khách hàng' },
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.invoice.new}
              startIcon={<Iconify icon={'eva:plus-fill'} />}
            >
              Tạo tài khoản
            </Button>
          }
        />

      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

