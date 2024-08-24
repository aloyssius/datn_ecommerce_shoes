import PropTypes from 'prop-types';
import React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Divider,
  Card,
  Stack,
  Typography,
  MenuItem,
} from '@mui/material';
import { TableMoreMenu } from '../../../../components/table';
// components
import Iconify from '../../../../components/Iconify';
import ProductVariantTableContainer from './ProductVariantTableContainer';

// ----------------------------------------------------------------------

const LabelStyleVariant = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.primary.main,
  fontSize: 15.5,
}));

const ProductVariantTableContainerMemo = React.memo(ProductVariantTableContainer);

const ProductNewEditVariant = ({ variants, isSubmitted, onRemoveColor, onRemoveSize, onRemoveSizes, onUpdateSize, onUpdateImageDefault, isEdit }) => {
  return (
    <>
      {variants?.map((variant) => (
        <Card className="card-product-variant" key={variant.colorId}>
          <Box sx={{ px: 2, py: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <LabelStyleVariant>{`'${variant.colorName}'`}</LabelStyleVariant>
              {!isEdit &&
                <TableMoreMenu
                  key={variant.colorId}
                  actions={
                    <>
                      {!isEdit &&
                        <MenuItem
                          onClick={() => onRemoveColor(variant.colorId)}
                          sx={{ color: 'error.main' }}
                        >
                          <Iconify icon={'eva:trash-2-outline'} />
                          Xóa
                        </MenuItem>
                      }
                    </>
                  }
                />
              }
            </Stack>
          </Box>
          <Divider />
          <Box>
            <ProductVariantTableContainerMemo
              isSubmitted={isSubmitted}
              key={variant.colorId}
              variant={variant}
              id={variant.key}
              onRemoveSize={onRemoveSize}
              onRemoveSizes={onRemoveSizes}
              onUpdateSize={onUpdateSize}
              onUpdateImageDefault={onUpdateImageDefault}
              isEdit={isEdit}
            />
          </Box>
        </Card>
      ))}
    </>
  );
};

// { isEdit &&
//   <MenuItem
//     sx={{ color: 'primary.main' }}
//   >
//     <Iconify icon={'eva:plus-circle-outline'} />
//     Thêm kích cỡ
//   </MenuItem>
//  }

ProductNewEditVariant.propTypes = {
  variants: PropTypes.array,
  onRemoveColor: PropTypes.func,
  onRemoveSizes: PropTypes.func,
  onRemoveSize: PropTypes.func,
  onUpdateSize: PropTypes.func,
};

export default React.memo(ProductNewEditVariant);
