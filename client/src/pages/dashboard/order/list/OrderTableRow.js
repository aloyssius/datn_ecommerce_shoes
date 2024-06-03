import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { VoucherStatusTabs } from '../../../../constants/enum';
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

OrderTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function OrderTableRow({ row, selected, onSelectRow, onEditRow }) {
  const theme = useTheme();

  const { code, fullName, phoneNumber, createdAt, totalMoney, status } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Link noWrap variant="body2" onClick={onEditRow} sx={{ color: 'black', cursor: 'pointer' }}>
            {`#${code}`}
          </Link>
        </Stack>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={fullName} color={createAvatar(fullName).color} sx={{ mr: 2 }}>
          {createAvatar(fullName).name}
        </Avatar>

        <Stack>
          <Typography variant="body2" noWrap>
            {fullName}
          </Typography>

          <Typography noWrap variant="body2" sx={{ color: 'text.disabled', fontSize: '13px' }}>
            {phoneNumber}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell >
        <Stack>
          <Typography variant="body2" noWrap>
            {'01 Jun 2024'}
          </Typography>

          <Typography noWrap variant="body2" sx={{ color: '#696969	', fontSize: '12px' }}>
            {'9:59 PM'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {totalMoney}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === VoucherStatusTabs.en.ACTIVE && 'success') ||
            (status === VoucherStatusTabs.en.UNACTIVE && 'warning') ||
            (status === VoucherStatusTabs.en.EXPIRED && '#d0d0d0') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="left">

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
