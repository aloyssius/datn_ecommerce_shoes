import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
import { All } from '../../../../constants/enum';
// utils
import getColorName from '../../../../utils/getColorName';
import { convertAccountStatus } from '../../../../utils/ConvertEnum';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
});

const WrapperStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  alignItems: 'stretch',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
}));

const LabelStyle = styled((props) => <Typography component="span" variant="subtitle2" {...props} />)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 10,
  color: theme.palette.text.dark,
  fontWeight: 'bold',
  backgroundColor: theme.palette.background.white,
  // borderRight: `solid 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

EmployeeTagFiltered.propTypes = {
  status: PropTypes.string,
  gender: PropTypes.string,
  isShowReset: PropTypes.bool,
  onRemoveStatus: PropTypes.func,
  onRemoveGender: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function EmployeeTagFiltered({
  status,
  gender,
  onRemoveStatus,
  onRemoveGender,
  isShowReset,
  onResetAll,
}) {

  return (
    <RootStyle>
      {status !== All.EN && (
        <WrapperStyle>
          <LabelStyle>Trạng thái:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={convertAccountStatus(status)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveStatus} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {gender !== All.VI && (
        <WrapperStyle>
          <LabelStyle>Giới tính:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={gender} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveGender} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}


      {!isShowReset && (
        <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
          Làm Mới
        </Button>
      )}
    </RootStyle>
  );
}
