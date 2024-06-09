import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { AccountGenderOption, AccountStatusTab } from '../../../../constants/enum';
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

EmployeTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function EmployeTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { code, fullName, birthDate, phoneNumber, email, gender, avatar, status } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
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
            {email}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {code}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{phoneNumber}</TableCell>

      <TableCell align="left">{birthDate}</TableCell>

      <TableCell align="left">{gender}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === AccountStatusTab.en.ACTIVE && 'success') ||
            (status === AccountStatusTab.en.UNACTIVE && 'warning') ||
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
