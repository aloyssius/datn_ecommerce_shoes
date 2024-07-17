import PropTypes from 'prop-types';
// @mui
import { Tooltip, Switch, IconButton, TableRow, TableCell, Typography, Stack, } from '@mui/material';
// components
import Label from '../../../../../components/Label';
import Image from '../../../../../components/Image';
import Iconify from '../../../../../components/Iconify';
import SwitchStyle from '../../../../../components/SwitchStyle';
import { AttributeStatus } from '../../../../../constants/enum';

// ----------------------------------------------------------------------

SizeTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  onUpdateRow: PropTypes.func,
  onRemoveRow: PropTypes.func,
};

export default function SizeTableRow({ row, onUpdateRow, onOpenEditRow, onRemoveRow }) {

  const { code, name, status, id } = row;

  const handleUpdate = (checked) => {
    const body = {
      id,
      status: checked ? AttributeStatus.en.IS_ACTIVE : AttributeStatus.en.UN_ACTIVE,
    };
    onUpdateRow(body);
  }

  return (
    <TableRow hover>
      <TableCell align="left">
        <Stack sx={{ width: 80 }}>
          <Label
            variant={'filled'}
            color={code}
          >
            {code}
          </Label>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack>
          <Typography variant="subtitle2" sx={{ maxWidth: 200 }}>
            {name}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">
        <Stack sx={{ ml: 0.5 }}>
          <SwitchStyle defaultChecked={status === AttributeStatus.en.IS_ACTIVE} action={handleUpdate} />
        </Stack>
      </TableCell>

      <TableCell align="left">

        <Stack spacing={2} direction="row">
          <Tooltip title='Cập nhật'>
            <IconButton onClick={onOpenEditRow}>
              <Iconify
                icon={'eva:edit-2-fill'}
                width={25}
                height={25}
                sx={{ color: 'primary.main' }}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa'>
            <IconButton onClick={onRemoveRow}>
              <Iconify
                icon={'eva:trash-2-outline'}
                width={25}
                height={25}
                sx={{ color: 'error.main' }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
