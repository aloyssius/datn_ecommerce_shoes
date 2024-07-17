import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
// @mui
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { TextFieldNumber } from './TextFieldNumber';
import SwitchStyle from '../../../../components/SwitchStyle';
import { ProductStatusTab } from '../../../../constants/enum';

// ----------------------------------------------------------------------

ProductVariantTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const TextFieldNumberMemo = React.memo(TextFieldNumber);
const SwitchStyleMemo = React.memo(SwitchStyle);

export default function ProductVariantTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }) {

  const { sizeName, quantity, status, colorId, sizeId } = row;

  const handleUpdateQuantity = useCallback((inputQuantity) => {
    onEditRow('quantity', colorId, sizeId, inputQuantity);
  }, []);

  const handleUpdateStatus = useCallback((status) => {
    onEditRow('status', colorId, sizeId, status);
  }, []);

  return (
    <TableRow selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} size="small" />
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {`'${sizeName}'`}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack sx={{ maxWidth: 100 }}>
          <TextFieldNumberMemo
            key={sizeId}
            quantity={quantity}
            onEditRow={handleUpdateQuantity}
          />
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack sx={{ ml: 0.5 }}>
          <SwitchStyleMemo defaultChecked={status === ProductStatusTab.en.IS_ACTIVE} action={handleUpdateStatus} />
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Tooltip title='Xóa kích cỡ' placement='right'>
          <IconButton onClick={onDeleteRow}>
            <Iconify
              icon={'eva:trash-2-outline'}
              width={23}
              height={23}
              sx={{ color: 'error.main' }}
            />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
