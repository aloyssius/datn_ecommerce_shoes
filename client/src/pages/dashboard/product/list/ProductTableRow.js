import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { format, parse } from 'date-fns';
import { FormControlLabel, Tooltip, Switch, Checkbox, IconButton, TableRow, TableCell, Typography, Stack, Link, MenuItem } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { ProductStatusTab } from '../../../../constants/enum';
// utils
import useAuth from '../../../../hooks/useAuth';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { convertProductStatus } from '../../../../utils/ConvertEnum';
import SwitchStyle from '../../../../components/SwitchStyle';

// ----------------------------------------------------------------------

ProductTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onEditRow: PropTypes.func,
  onUpdateRow: PropTypes.func,
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


export default function ProductTableRow({ row, onEditRow, onUpdateRow }) {
  const theme = useTheme();
  const {user} = useAuth();
  const { id, code, name, brand, imageUrl, createdAt, totalQuantity, status, stockStatus } = row;

  const parsedDateTime = parse(createdAt, 'HH:mm:ss dd-MM-yyyy', new Date());
  const formattedDate = format(parsedDateTime, 'dd/MM/yyyy');
  const formattedTime = format(parsedDateTime, 'HH:mm');

  const handleUpdate = (checked) => {
    const body = {
      id,
      statusProduct: checked ? ProductStatusTab.en.IS_ACTIVE : ProductStatusTab.en.UN_ACTIVE,
    };
    onUpdateRow(body);
  }

  return (
    <TableRow hover>
      <TableCell align="left">
        <Stack>
          {user?.role === 'admin' ?
          <Link noWrap variant="subtitle2" onClick={onEditRow} sx={{ color: 'primary.main', cursor: 'pointer' }}>
            {`${code}`}
          </Link>
            :
          <Typography variant="subtitle2" noWrap sx={{ color: 'primary.main'}}>
            {code}
          </Typography>
          }
        </Stack>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Stack>
          <Image disabledEffect alt={imageUrl} src={imageUrl} sx={{ borderRadius: 1.5, width: 68, height: 68, mr: 2 }} />
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
        {user?.role === 'admin' ? 
        <Stack sx={{ ml: 0.5 }}>
          <SwitchStyle defaultChecked={status === ProductStatusTab.en.IS_ACTIVE} action={handleUpdate} />
        </Stack>
        :
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === ProductStatusTab.en.UN_ACTIVE && 'error') ||
            (status === ProductStatusTab.en.IS_ACTIVE && 'success')
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {convertProductStatus(status)}
        </Label>
        }
      </TableCell>

      <TableCell align="left">

        {user?.role === 'admin' ? 
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
        :
          null
        }
      </TableCell>
    </TableRow>
  );
}
