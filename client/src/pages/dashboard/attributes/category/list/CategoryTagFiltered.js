import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
import { All } from '../../../../../constants/enum';
// utils
import { convertAttributeStatus } from '../../../../../utils/ConvertEnum';
// components
import Iconify from '../../../../../components/Iconify';

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

CategoryTagFiltered.propTypes = {
  status: PropTypes.string,
  isShowReset: PropTypes.bool,
  onRemoveStatus: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function CategoryTagFiltered({
  status,
  onRemoveStatus,
  isShowReset,
  onResetAll,
}) {

  return (
    <>
      <RootStyle>
        {status !== All.EN && (
          <WrapperStyle>
            <LabelStyle>Trạng thái:</LabelStyle>
            <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
              <Chip size="small" color='primary' label={convertAttributeStatus(status)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveStatus} sx={{ m: 0.5 }} />
            </Stack>
          </WrapperStyle>
        )}

        {!isShowReset && (
          <Button color="error" size="small" onClick={onResetAll} startIcon={<Iconify icon={'ic:round-clear-all'} />}>
            Làm Mới
          </Button>
        )}
      </RootStyle>
    </>
  );
}
