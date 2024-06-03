import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import { CustomerStatusTab } from '../../../../constants/enum';
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

CustomerTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};

export default function CustomerTableRow({ row, selected, onSelectRow, onEditRow, onDeleteRow }) {
    const theme = useTheme();

    const { code, name, birth, phone, email, gender, avatar, status } = row;

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
            {/* Product
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image disabledEffect alt={name} src={cover} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      // account
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>
      */}

            <TableCell align="left">{name}</TableCell>

            <TableCell align="left">{birth}</TableCell>

            {/* <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {value}
      </TableCell> */}

            <TableCell align="left">{phone}</TableCell>

            <TableCell align="left">{email}</TableCell>

            <TableCell align="left">{gender}</TableCell>

            <TableCell align="left">{avatar}</TableCell>

            <TableCell align="left">
                <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={
                        (status === CustomerStatusTab.en.ACTIVE && 'success') ||
                        (status === CustomerStatusTab.en.UNACTIVE && 'warning') ||
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
