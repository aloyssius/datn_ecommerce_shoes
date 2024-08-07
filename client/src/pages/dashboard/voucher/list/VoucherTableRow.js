import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { format, parse } from 'date-fns';
import { DiscountStatusTab, VoucherTypeDiscountVoucherTableRow } from '../../../../constants/enum';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

VoucherTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
};

export default function VoucherTableRow({ row, onEditRow }) {
  const theme = useTheme();

  const { code, name, type, value, quantity, startTime, endTime, status, typeDiscount } = row;

  const parsedStartTime = parse(startTime, 'HH:mm:ss dd-MM-yyyy', new Date());
  const parsedEndTime = parse(endTime, 'HH:mm:ss dd-MM-yyyy', new Date());

  const formattedStartTime = format(parsedStartTime, 'dd/MM/yyyy');
  const formattedEndTime = format(parsedEndTime, 'dd/MM/yyyy');

  return (
    <TableRow hover>
      <TableCell align="left">
        <Stack>
          <Link noWrap variant="subtitle2" onClick={onEditRow} sx={{ color: 'primary.main', cursor: 'pointer' }}>
            {`${code}`}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{value} {typeDiscount === 'percent' ? VoucherTypeDiscountVoucherTableRow.vi.PERCENT : VoucherTypeDiscountVoucherTableRow.vi.VND}</TableCell>

      <TableCell align="left">{quantity}</TableCell>

      <TableCell align="left">{formattedStartTime}</TableCell>
      <TableCell align="left">{formattedEndTime}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === DiscountStatusTab.en.ON_GOING && 'success') ||
            (status === DiscountStatusTab.en.UP_COMMING && 'warning') ||
            (status === DiscountStatusTab.en.FINISHED && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="center">

        <Tooltip title='Cập nhật'>
          <IconButton onClick={onEditRow}>
            <Iconify
              icon={'eva:edit-2-fill'}
              width={25}
              height={25}
              sx={{ color: 'primary.main' }}
            />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
