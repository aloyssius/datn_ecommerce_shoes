import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Chip, Typography, Stack, Button } from '@mui/material';
import { All } from '../../../../constants/enum';
// utils
import getColorName from '../../../../utils/getColorName';
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

function labelPriceRange(range) {
  if (range === 'below') {
    return 'Below $25';
  }
  if (range === 'between') {
    return 'Between $25 - $75';
  }
  return 'Above $75';
}

OrderTagFiltered.propTypes = {
  status: PropTypes.string,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  isShowReset: PropTypes.bool,
  onRemoveStatus: PropTypes.func,
  onRemoveDate: PropTypes.func,
  onResetAll: PropTypes.func,
};

export default function OrderTagFiltered({
  status,
  startDate,
  endDate,
  onRemoveStatus,
  onRemoveDate,
  isShowReset,
  onResetAll,
}) {
  const dateCurrent = new Date();

  const monthNames = [...Array(12).keys()].map(month =>
    new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(2024, month))
  );

  const getDateLabel = (startDate, endDate) => {
    const monthName = monthNames[dateCurrent.getMonth()];

    if (startDate && !endDate) {
      return `${startDate.getDate()} - ? ${monthName} 2024`;
    }
    if (endDate && !startDate) {
      return `? - ${endDate.getDate()} ${monthName} 2024`;
    }
    if (startDate && endDate) {
      return `${startDate.getDate()} - ${endDate.getDate()} ${monthName} 2024`;
    }
    return 'No Dates Available';
  };

  return (
    <RootStyle>
      {status !== All.EN && (
        <WrapperStyle>
          <LabelStyle>Trạng thái:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={status} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveStatus} sx={{ m: 0.5 }} />
          </Stack>
        </WrapperStyle>
      )}

      {(startDate || endDate) && (
        <WrapperStyle>
          <LabelStyle>Ngày tạo:</LabelStyle>
          <Stack direction="row" flexWrap="wrap" sx={{ p: 0.75 }}>
            <Chip size="small" color='primary' label={getDateLabel(startDate, endDate)} deleteIcon={'ic:round-clear-all'} onDelete={onRemoveDate} sx={{ m: 0.5 }} />
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
