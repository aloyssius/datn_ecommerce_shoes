import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  TableRow,
  TableFooter,
  TableCell,
} from '@mui/material';
import { TextFieldPrice } from './TextFieldNumber';
import ProductVariantTableFooterUpload from './ProductVariantTableFooterUpload';

// ----------------------------------------------------------------------

ProductVariantTableFooter.propTypes = {
  variant: PropTypes.object,
  onUpdateImages: PropTypes.func,
  onUpdatePrice: PropTypes.func,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  fontSize: 14,
}));

const ProductVariantTableFooterUploadMemo = React.memo(ProductVariantTableFooterUpload);

export default function ProductVariantTableFooter({ variant, onUpdatePrice, onUpdateImages, isSubmitted, onUpdateImageDefault, isEdit }) {

  const handleUpdateImages = useCallback((images) => {
    onUpdateImages(variant?.colorId, images);
  }, []);

  const handleUpdateImageDefault = useCallback((path) => {
    onUpdateImageDefault(variant?.colorId, path);
  }, []);

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={5}>
          <Stack direction="row" display="flex" justifyContent="space-between" sx={{ py: 1 }}>
            <Stack>
              <LabelStyle sx={{ mt: 1 }}>Đơn giá</LabelStyle>
            </Stack>
            <TextFieldPrice variant={variant} onUpdatePrice={onUpdatePrice} isSubmitted={isSubmitted} />
          </Stack>
        </TableCell>
      </TableRow>
      <ProductVariantTableFooterUploadMemo 
        onUpdateImageDefault={handleUpdateImageDefault} 
        isSubmitted={isSubmitted}
        productImages={variant.images}
        onUpdateImages={handleUpdateImages} 
        variant={variant}
        isEdit={isEdit}
      />
    </TableFooter>
  );
};
