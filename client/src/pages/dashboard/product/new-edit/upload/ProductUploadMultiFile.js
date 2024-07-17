import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
//
import BlockContent from './ProductBlockContentFile';
import RejectionFiles from '../../../../../components/upload/RejectionFiles';
import MultiFilePreview from './ProductMultiFilePreview';

// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(3, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${theme.palette.grey[500_32]}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

ProductUploadMultiFile.propTypes = {
  error: PropTypes.bool,
  showPreview: PropTypes.bool,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  helperText: PropTypes.node,
  sx: PropTypes.object,
};

export default function ProductUploadMultiFile({
  error,
  showPreview = false,
  files,
  onRemove,
  onRemoveAll,
  helperText,
  sx,
  onUpdateImageDefault,
  isEdit,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    ...other,
  });

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {
            color: 'error.main',
            borderColor: 'error.light',
            bgcolor: 'error.lighter',
          }),
        }}
      >
        <input {...getInputProps()} />

        <BlockContent />
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      <MultiFilePreview onUpdateImageDefault={onUpdateImageDefault} files={files} showPreview={showPreview} onRemove={onRemove} onRemoveAll={onRemoveAll} isEdit={isEdit} />

      <Typography sx={{ mt: 1, color: 'error.main', fontSize: 12 }}>
        {helperText && helperText}
      </Typography>
    </Box>
  );
}
