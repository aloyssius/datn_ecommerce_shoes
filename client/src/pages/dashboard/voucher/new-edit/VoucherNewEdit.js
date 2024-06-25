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
import VoucherNewEditForm from './VoucherNewEditForm';

// ----------------------------------------------------------------------

export default function VoucherNewEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const currentVoucher = {};

  return (

    <Page title={`Quản lý mã giảm giá - ${!isEdit ? 'Tạo mã giảm giá' : 'Cập nhật mã giảm giá'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo mã giảm giá' : 'Cập nhật mã giảm giá'}
          links={[
            { name: 'Danh sách mã giảm giá', href: PATH_DASHBOARD.discount.voucher.list },
            { name: !isEdit ? 'Tạo mã giảm giá' : 'Voucher-name' },
          ]}
        />
        <VoucherNewEditForm isEdit={isEdit} currentVoucher={currentVoucher} />
      </Container>
    </Page>
  );
}
