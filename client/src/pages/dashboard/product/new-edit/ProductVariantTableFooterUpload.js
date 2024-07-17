import PropTypes from 'prop-types';
import React, { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Typography,
  TableRow,
  TableCell,
} from '@mui/material';
import ProductUploadMultiFile from './upload/ProductUploadMultiFile';
// hooks
import useNotification from '../../../../hooks/useNotification';

// ----------------------------------------------------------------------

ProductVariantTableFooterUpload.propTypes = {
  onUpdateImages: PropTypes.func,
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  fontSize: 14,
}));

const IMAGE_MAX_LENGTH = 8;
const IMAGE_MIN_LENGTH = 4;

export default function ProductVariantTableFooterUpload({ onUpdateImages, variant, productImages, isSubmitted, onUpdateImageDefault, isEdit }) {

  const { onOpenErrorNotify } = useNotification();

  const handleDrop = (acceptedFiles) => {

    const newImages = [...variant.imageFiles];

    acceptedFiles.forEach((file) => {
      const isDuplicate = newImages.some((image) => image.name === file.name);

      if (!isDuplicate) {
        newImages.push(Object.assign(file, { preview: URL.createObjectURL(file) }));
      }
    });

    if (newImages.length > IMAGE_MAX_LENGTH) {
      onOpenErrorNotify("Chỉ được phép chọn tối đa 8 ảnh!")
      return;
    }

    console.log(newImages)
    onUpdateImages(Array.from(newImages));
  };

  const handleRemoveAll = () => {
    onUpdateImages([]);
  };

  const handleRemove = (file) => {
    const filteredItems = variant.imageFiles.filter((_file) => _file.path !== file.path);
    onUpdateImages(filteredItems);
  };

  const getHelperText = () => {
    if (!isSubmitted) {
      return "";
    }

    if (productImages.length <= IMAGE_MIN_LENGTH - 1) {
      return "Vui lòng chọn ít nhất 4 hình ảnh cho sản phẩm.";
    }

    if (productImages.every((image) => !image?.isDefault)) {
      return "Vui lòng chọn hỉnh mặc mặc định cho sản phẩm.";
    }

    return "";
  }

  const getError = () => {
    if (!isSubmitted) {
      return false;
    }

    if (productImages.length <= IMAGE_MIN_LENGTH) {
      return true;
    }

    if (productImages.every((image) => !image?.isDefault)) {
      return true;
    }

    return false;
  }

  return (
    <TableRow className="table-row">
      <TableCell colSpan={5}>
        <Stack direction="row" display="flex" justifyContent="space-between" sx={{ py: 1 }}>
          <Stack>
            <LabelStyle>Hình ảnh</LabelStyle>
          </Stack>
          <ProductUploadMultiFile
            sx={{ width: "75%" }}
            showPreview
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemove}
            onRemoveAll={handleRemoveAll}
            files={productImages}
            onUpdateImageDefault={onUpdateImageDefault}
            error={getError()}
            helperText={getHelperText()}
            isEdit={isEdit}
          />
        </Stack>
      </TableCell>
    </TableRow>
  );
};
