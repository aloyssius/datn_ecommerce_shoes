import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { format, parse } from 'date-fns';
import { DiscountStatusTab } from '../../../../constants/enum';
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
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function VoucherTableRow({ row, selected, onSelectRow, onEditRow }) {
  const theme = useTheme();

  const { code, name, type, value, quantity, startTime, endTime, status } = row;

  const parsedStartTime = parse(startTime, 'HH:mm:ss dd-MM-yyyy', new Date());

  const parsedEndTime = parse(endTime, 'HH:mm:ss dd-MM-yyyy', new Date());


  const formattedStartTime = format(parsedStartTime, 'dd/MM/yyyy');

  const formattedEndTime = format(parsedEndTime, 'dd/MM/yyyy');

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {code}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{name}</TableCell>

      <TableCell align="left">{type}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {value}
      </TableCell>

      <TableCell align="left">{quantity}</TableCell>

      <TableCell align="left">{formattedStartTime} - {formattedEndTime}</TableCell>

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
