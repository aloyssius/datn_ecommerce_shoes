import PropTypes from 'prop-types';
// @mui
import { format, parse } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { BillStatusTab } from '../../../../constants/enum';
// utils
import createAvatar from '../../../../utils/createAvatar';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { convertOrderStatus } from '../../../../utils/ConvertEnum';
import { displayCurrencyVnd } from '../../../../utils/formatCurrency';

// ----------------------------------------------------------------------

BillTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
};

export default function BillTableRow({ row, onEditRow }) {
  const theme = useTheme();

  const { code, fullName, phoneNumber, createdAt, totalMoney, status } = row;

  const parsedDateTime = parse(createdAt, 'HH:mm:ss dd-MM-yyyy', new Date());
  const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
  const formattedTime = format(parsedDateTime, 'HH:mm');

  return (
    <TableRow hover >

      <TableCell align="left">
        <Stack>
          <Link noWrap variant="subtitle2" onClick={onEditRow} sx={{ color: 'primary.main', cursor: 'pointer' }}>
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
            {formattedDate}
          </Typography>

          <Typography noWrap variant="body2" sx={{ color: '#696969	', fontSize: '12px' }}>
            {formattedTime}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize', color: '#CF000F' }}>
        {displayCurrencyVnd(totalMoney)}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === BillStatusTab.en.COMPLETED && 'success') ||
            (status === BillStatusTab.en.PENDING_CONFIRM && 'warning') ||
            (status === BillStatusTab.en.CANCELED && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {convertOrderStatus(status)}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === BillStatusTab.en.COMPLETED && 'success') ||
            (status === BillStatusTab.en.PENDING_CONFIRM && 'warning') ||
            (status === BillStatusTab.en.CANCELED && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {convertOrderStatus(status)}
        </Label>
      </TableCell>

      <TableCell align="left">

        <Tooltip title='Chỉnh sửa'>
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
