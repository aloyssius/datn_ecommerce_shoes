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
import ProductNewEditForm from './ProductNewEditForm';

// ----------------------------------------------------------------------

export default function ProductNewEdit() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEdit = pathname.includes('edit');
  const currentProduct = {};

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
        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
