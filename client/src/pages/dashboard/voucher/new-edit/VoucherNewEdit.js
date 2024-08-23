import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

export default function VoucherNewEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const { data } = useFetch(ADMIN_API.voucher.details(id), { fetch: isEdit })
  const navigate = useNavigate();


  const handleUpdateData = (updatedVoucher) => {
    // Thực hiện hành động sau khi cập nhật dữ liệu voucher thành công
    console.log('Voucher updated:', updatedVoucher);
    // Ví dụ: Chuyển hướng về danh sách voucher
    navigate(PATH_DASHBOARD.discount.voucher.list);
  };

  return (

    <Page title={`Quản lý mã giảm giá - ${!isEdit ? 'Tạo mã giảm giá' : 'Cập nhật mã giảm giá'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo mã giảm giá' : 'Cập nhật mã giảm giá'}
          links={[
            { name: 'Danh sách mã giảm giá', href: PATH_DASHBOARD.discount.voucher.list },
            { name: !isEdit ? 'Tạo mã giảm giá' : data?.code },
          ]}
        />
        <VoucherNewEditForm isEdit={isEdit}
          currentVoucher={data}
          onUpdateData={handleUpdateData}
        />
      </Container>
    </Page>
  );
}
