import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import ProductNewEditForm from './ProductNewEditForm';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';

// ----------------------------------------------------------------------

export default function ProductNewEdit() {
  const { themeStretch } = useSettings();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = location.pathname.includes('edit');
  const { data, setData } = useFetch(ADMIN_API.product.details(id), { fetch: isEdit })

  return (

    <Page title={`Quản lý sản phẩm - ${!isEdit ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}`}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}
          links={[
            { name: 'Danh sách sản phẩm', href: PATH_DASHBOARD.product.list },
            { name: !isEdit ? 'Tạo sản phẩm' : 'Product-name' },
          ]}
        />
        <ProductNewEditForm isEdit={isEdit} currentProduct={data} onUpdateData={setData} />
      </Container>
    </Page>
  );
}
