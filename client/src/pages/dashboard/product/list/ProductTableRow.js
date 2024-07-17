import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { format, parse } from 'date-fns';
import { FormControlLabel, Tooltip, Switch, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { ProductStatusTab } from '../../../../constants/enum';
// utils
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { convertProductStatus } from '../../../../utils/ConvertEnum';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
};

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const BorderLinearProgress = ({ value }) => {
  const theme = useTheme();

  const normalizedValue = Math.min(Math.max(0, value), 100);

  return (
    <LinearProgress
      variant="determinate"
      value={normalizedValue}
      sx={{
        height: 6.5,
        width: 90,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: normalizedValue > 0 ? theme.palette.grey[200] : theme.palette.error.light,
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: normalizedValue >= 10 ? '#22C55E' : '#FFAB00',
        },
      }}
    />
  );
};


export default function ProductTableRow({ row, onEditRow }) {
  const theme = useTheme();

  const { code, name, brand, image, createdAt, totalQuantity, status, stockStatus } = row;

  const parsedDateTime = parse(createdAt, 'HH:mm:ss dd-MM-yyyy', new Date());
  const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
  const formattedTime = format(parsedDateTime, 'HH:mm');

  return (
    <TableRow hover>
      <TableCell align="left">
        <Stack>
          <Link noWrap variant="subtitle2" onClick={onEditRow} sx={{ color: 'primary.main', cursor: 'pointer' }}>
            {`${code}`}
          </Link>
        </Stack>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack>
          <Image disabledEffect alt={name} src={'https://yt3.ggpht.com/lJH51Bb8zpgPKx9u1-v1y0NHsn_PI8MwT6CiyHVd8aChbpzcR0zeN5BE-AjBjckKePM8KtHFyQw=s88-c-k-c0x00ffffff-no-rj'} sx={{ borderRadius: 1.5, width: 68, height: 68, mr: 2 }} />
        </Stack>
        <Stack>
          <Typography variant="subtitle2" sx={{ maxWidth: 200 }}>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack>
          <Typography variant="body2" noWrap>
            {formattedDate}
          </Typography>

          <Typography noWrap variant="body2" sx={{ color: '#696969	', fontSize: '12px' }}>
            {formattedTime}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="body2" noWrap>
            {brand}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="body2" noWrap>
            <BorderLinearProgress variant="determinate" value={totalQuantity} />
          </Typography>
          <Typography noWrap variant="body2" sx={{ color: '#696969	', fontSize: '12px', marginTop: 1 }}>
            {`${totalQuantity} (${stockStatus})`}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack sx={{ ml: 0.5 }}>
          <FormControlLabel
            control={<Android12Switch defaultChecked />}
          />
        </Stack>
        {/*
        <Stack sx={{mt: 0.3}}>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (status === ProductStatusTab.en.IS_ACTIVE && 'success') ||
              (status === ProductStatusTab.en.UN_ACTIVE && 'error') ||
              'default'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {convertProductStatus(status)}
          </Label>
        </Stack>
        */}
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
