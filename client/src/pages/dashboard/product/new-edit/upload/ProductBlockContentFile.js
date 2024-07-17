// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../../../../assets';
// components
import Iconify from '../../../../../components/Iconify';

// ----------------------------------------------------------------------

export default function ProductBlockContentFile() {
  return (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      direction="row"
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 120 }} />
      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 300 }}>
          Kéo thả hoặc {" "}
          <Typography
            variant="body2"
            component="span"
            sx={{ color: 'primary.main' }}
          >
            tải ảnh lên từ thiết bị của bạn
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
}

