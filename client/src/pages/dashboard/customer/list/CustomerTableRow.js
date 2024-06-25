import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, IconButton, TableRow, TableCell, Typography, Stack, Link } from '@mui/material';
import { AccountStatusTab } from '../../../../constants/enum';
// utils
import createAvatar from '../../../../utils/createAvatar';
// components
import Label from '../../../../components/Label';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { convertAccountStatus } from '../../../../utils/ConvertEnum';

// ----------------------------------------------------------------------

CustomerTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
};

export default function CustomerTableRow({ row, onEditRow }) {
  const theme = useTheme();

  const { code, fullName, phoneNumber, email, gender, avatarUrl, status } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {code}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={fullName} color={createAvatar(fullName).color} sx={{ mr: 2 }}>
          {createAvatar(fullName).name}
        </Avatar>

        <Stack>
          <Link noWrap variant="subtitle2" onClick={onEditRow} sx={{ color: 'primary.main', cursor: 'pointer' }}>
            {fullName}
          </Link>
        </Stack>
      </TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left">{phoneNumber}</TableCell>

      <TableCell align="left">{gender === 0 ? 'Nam' : 'Nữ'}</TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === AccountStatusTab.en.IS_ACTIVE && 'success') ||
            (status === AccountStatusTab.en.UN_ACTIVE && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {convertAccountStatus(status)}
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
