import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Tooltip, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { ProductStatusTab } from '../../../../constants/enum';
// utils
import { fDate } from '../../../../utils/formatTime';
import createAvatar from '../../../../utils/createAvatar';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Avatar from '../../../../components/Avatar';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
const BorderLinearProgress = ({ value }) => {
  const theme = useTheme();

  const normalizedValue = Math.min(Math.max(0, value), 100);

  return (
    <LinearProgress
      variant="determinate"
      value={normalizedValue}
      sx={{
        height: 6.5,
        width: 100,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#22C55E' : '#22C55E',
        },
      }}
    />
  );
};


export default function ProductTableRow({ row, selected, onSelectRow, onEditRow }) {
  const theme = useTheme();

  const { sku, name, brand, image, createdAt, quantity, status } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image disabledEffect alt={name} src={'https://api-prod-minimal-v510.vercel.app/assets/images/m_product/product_2.jpg'} sx={{ borderRadius: 1.5, width: 68, height: 68, mr: 2 }} />
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>

          <Typography noWrap variant="body2" sx={{ color: 'text.disabled', fontSize: '13px' }}>
            {brand}
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

      <TableCell align="left">
        <Stack>
          <Typography variant="body2" noWrap>
            <BorderLinearProgress variant="determinate" value={quantity} />
          </Typography>
          <Typography noWrap variant="body2" sx={{ color: '#696969	', fontSize: '12px', marginTop: 1 }}>
            {`${quantity} ${quantity === 0 ? '(Hết hàng)' : '(Còn hàng)'}`}

          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" noWrap>
            {sku}
          </Typography>
        </Stack>
      </TableCell>


      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === ProductStatusTab.en.IS_ACTIVE && 'success') ||
            (status === ProductStatusTab.en.UN_ACTIVE && 'error') ||
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
