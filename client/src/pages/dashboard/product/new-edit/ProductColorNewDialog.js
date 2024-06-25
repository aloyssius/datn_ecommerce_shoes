import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Dialog, Stack, Typography, Button, TextField, Tooltip, IconButton } from '@mui/material';
// components
import useNotification from '../../../../hooks/useNotification';
import { isValidColorHex } from '../../../../utils/validate';
import ColorSquare from './ColorSquare';

// ----------------------------------------------------------------------

ProductColorNewDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  colorName: PropTypes.string,
  onColorName: PropTypes.func,
  onAddColor: PropTypes.func,
};

export default function ProductColorNewDialog({ open, onClose, colorName, onColorName, onAddColor }) {

  const { onOpenErrorNotify } = useNotification();

  const [name, setName] = useState('');
  const [hex, setHex] = useState('');

  useEffect(() => {
    setName(colorName);
    setHex('');
  }, [colorName]);

  const handleAddColor = () => {
    if (name?.trim() === '') {
      onOpenErrorNotify('Tên màu không hợp lệ!');
      return;
    }

    if (!isValidColorHex(hex)) {
      onOpenErrorNotify('Mã màu không hợp lệ!');
      return;
    }

    onAddColor(name, hex);
  }

  const handleClose = () => {
    onClose();
    onColorName('');
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose} sx={{ bottom: 200 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 3, px: 3 }}>
        <Typography variant="h6"> Thêm mới màu sắc </Typography>
      </Stack>
      <Stack spacing={3} sx={{ px: 3, height: 210 }}>
        <TextField
          value={name}
          label="Tên màu sắc"
          fullWidth
          onChange={(event) => { setName(event.target.value); }}
        />
        <TextField
          value={hex}
          label="Mã màu"
          fullWidth
          onChange={(event) => { setHex(event.target.value); }}
          InputProps={{
            endAdornment: isValidColorHex(hex) &&
              <ColorSquare color={hex} name={hex} />
          }}
        />
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button color="inherit" size="small" onClick={handleClose}>
            Hủy bỏ
          </Button>
          <Button size="small" variant="contained" onClick={handleAddColor}>
            Thêm mới
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}
